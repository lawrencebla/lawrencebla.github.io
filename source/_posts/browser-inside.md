---
title: 浏览器工作过程
date: 2019-09-25 10:53:06
tags:
---

# 浏览器架构

浏览器内部有许多进程负责浏览器中不同的模块功能，如浏览器进程负责浏览器的宿主部分，渲染进程负责文档的渲染部分。进程之间通过IPC进行通信。
{% asset_img 01.png %}

进程中还可能存在许多线程。
{% asset_img 02.png %}
*浏览器进程包含UI线程，网络线程等。*

具体的进程和线程在不同浏览器中，实现方式各不相同。这里以chrome为例。

chrome会为每个tab都创建一个渲染进程，保证页面生命周期与内容的隔离，还避免了被其他tab阻塞渲染的问题；浏览器进程负责与其他进程之间进行协调。
{% asset_img 03.png %}

chrome中主要有如下几个进程：
* 浏览器进程：负责宿主环境的UI功能（UI线程，如地址栏，书签，后退等）、网络功能（网络线程）、IO功能（存储线程）以及授权功能*。
* 渲染进程：负责渲染页面的内容。
* GPU进程：将渲染的内容光栅化显示到屏幕中。
* 插件进程：负责页面插件功能。
{% asset_img 04.png %}
<!-- more --> 

# 浏览器渲染流程
## 初始化/重定向
当用户在地址栏中进行输入，当用户按下回车时，UI线程判断如果输入的内容时一个URL，通知网络线程进行请求。

网络线程会进行安全校验：检查请求的URL是否安全或者跨域，不安全提示用户并终止后续行为；
网络线程也会处理一些响应的结果，如返回的http头301，则进行重定向，发起另外一个网络请求；
当检测到Content-Type为html时，会将数据传递到渲染进程。

{% asset_img 05.png %}
*检测完毕后，UI线程还会更新浏览器的“历史记录”，“网站状态”等信息*

当tab关闭或者重定向时，浏览器进程会询问渲染进程，是否有绑定beforeunload方法并调用
{% asset_img 06.png %}

## 渲染
渲染进程用于将页面内容展示到屏幕中。
{% asset_img 07.png %}
*渲染进程主要由主线程、组合线程、光栅线程等组成*
### 解析生成dom树
渲染进程接收到HTML时，交给主线程将HTML文本解析为DOM树。
{% asset_img parsing-model-overview.png %}

由于JS代码可能会修改DOM树，所以JS会阻塞主DOM的生成，当JS执行结束后，才会继续解析生成DOM；如果你确保JS代码中，没有修改DOM的内容，可以使用async或defer使JS异步执行，不阻塞DOM的生成。

* preload：为了让首屏网络可以留给最需要展示的内容，有些不那么重要的资源可以标记为preload；
* prefetch 对于第二屏需要展示的内容，可以使用prefetch进行标记，在网络请求充足的情况下，会获取prefetch的资源。
*preload的优先级高于prefetch*

### 加载资源
正常情况下，解析HTML时遇到了img或link标签时，才会去加载资源；但是为了优化性能，渲染进程会预扫描一遍HTML文本，当检测到由img或link标签时，会启动浏览器进程中的网络线程进行请求预加载数据。
{% asset_img 08.png %}

### 生成css树
只有DOM树的情况下，浏览器并不知道每个DOM应该是什么样子，这个时候就需要CSS树；主线程解析CSS文件，并根据选择器绘制出一颗CSS树。
{% asset_img 09.png %}
### 生成布局树
只有DOM树和CSS树的情况下，浏览器只知道有CSS描述的内容该如何展示，如颜色、字体或定义过的宽、高等；而其他的元素浏览器不知道该显示在哪里，显示多大，所以布局树就是根据文档流，计算出每个元素排列后应该在的位置，宽高等。
布局树的元素与DOM树类似，但是又有些不同；比如：伪元素会在布局树中存在；display: none却不在布局树中存在。
{% asset_img 10.png %}

### 绘制步骤
渲染进程会根据上面完成的DOM树、CSS树及布局树，创建绘制步骤。
如先画一个长方形，位置多少，宽高是多少，什么颜色；下一步再绘制一个文本。
{% asset_img 11.png %}

### 光栅化
有了绘制步骤后，浏览器可以根据窗口大小及位置，将内容绘转换为像素；这个步骤被叫做光栅化；当滚动时，窗口位置调整，绘制更多的信息。
{% asset_img 12.png %}

### 图层树
对整个页面光栅化会导致一个问题：如果对页面页面元素或样式进行修改，会重新对整个页面重新生成布局树及绘制步骤等；而现代很多页面都会出现大量修改的功能。
为了优化这一过程现代浏览器引入了图层树的概念；即将页面分为不同图层，并对每个图层做单独光栅化；单个图层中的内容被改动后，只有单个图层被重新生成布局树和绘制。
{% asset_img 13.png %}

但是如果对每个元素都做成一个图层，浏览器消耗的资源也非常大，所以浏览进程的主线程会计算哪个元素属于哪个图层
{% asset_img 14.png %}

* will-change：一些如侧边收缩栏这种更新频繁，又不影响文档流；可以使用will-change属性，告诉浏览器，把这个元素做成一个单独的图层；被标记的元素属性修改后，只会重新处理自己这个图层。

上面的光栅化好的图层，会由合成线程根据窗口位置大小，判断哪些内容需要展示，并将光栅化之后的内容合成在一起，当窗口改变时，会渲染新的帧用于填充。


## 事件

用户对页面进行操作时，浏览器进程会监听到时什么事件在哪个位置。
再把位置发给渲染进程，渲染进程通过绘制过程中的数据，确定事件响应在哪个元素中，用来处理事件回调。

当对应元素处于可视窗口中时，浏览器会将事件发送给主线程，等待主线程理事件回调完毕， 然后在重新进行合成，这就会造成浏览器的展示不流畅；我们可以添加addEventListener的第三个参数：{ passive, true }用于告诉浏览器，合成新帧时不需要等待（如果需要禁用浏览器的默认事件，不能加入该参数）。

## 帧数
为了使页面看起来更平顺，大多数显示器至少保持着60帧的速度在刷新（即每秒60次），当低于60帧时，会感觉到页面卡顿现象。

### JS阻塞
由于页面中树的生成、绘制步骤，都在渲染进程的主线程中执行，js代码也是在主线程中执行，所以当有花费时间较高js在执行时，进行页面绘制会被阻塞。
{% asset_img 15.png %}

使用requestAnimationFrame可以拆分长时间js，在每个页面更新周期执行一部分代码，避免页面更新延迟。
{% asset_img 16.png %}


也可以将这部分代码放入Web Worker中，由于Web Worker有专门的worker线程进行处理，所以不会造成主线程的更新延迟。

### 事件延迟

当用户事件的频率超过浏览器更新帧数时，会出现事件延迟问题。
如FPS为60，鼠标滑动时，每秒滑动120次，第一帧渲染第一个事件，第二帧渲染第二个事件，1秒后只能渲染前60次的渲染结果，即只完成了一半。
{% asset_img 17.png %}

对此浏览器合并了高频事件，将执行延迟到下一个requestAnimationFrame之前
{% asset_img 18.png %}

但是如果用户像用到真实所有的事件（如画一条弧线时），合并帧对导致中间线条不圆滑；
浏览器在evnet事件中，提供了getCoalescedEvents方法，可以取出所有真实的事件，以供用户使用。
{% asset_img 19.png %}

# 参考
* [Inside look at modern web browser (part 1)](https://developers.google.com/web/updates/2018/09/inside-browser-part1)
* [Inside look at modern web browser (part 2)](https://developers.google.com/web/updates/2018/09/inside-browser-part2)
* [Inside look at modern web browser (part 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
* [Inside look at modern web browser (part 4)](https://developers.google.com/web/updates/2018/09/inside-browser-part4)
* [Resource Prioritization](https://developers.google.com/web/fundamentals/performance/resource-prioritization)
* [Optimizing JavaScript Execution](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution)