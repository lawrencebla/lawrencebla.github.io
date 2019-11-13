---
title: 渲染方式简介
date: 2019-11-06 18:50:05
tags:
---

从我开发前端以来,经历过纯html,jsp,jquery+模板,react以及nuxt开发,下面是一些对于不同方式的开发模式,对应渲染方式总结.
<!-- more --> 

# 渲染时间概念
* RTT: 从浏览器发起请求,到服务端有响应的时间
{% asset_img 00.png %}
* TTFB: 从服务器开始有返回数据的时间
{% asset_img 01.png %}
* FP: 内容第一次被渲染的时间
* FCP: 第一个内容出现在屏幕的时间
* FMP: 第一个有效的内容出现在屏幕的时间
* TTI: 用户第一次可以操作的时间
{% asset_img 02.png %}

# 渲染方式

## 静态渲染
静态渲染通常是有限个数的纯静态页面,JS功能也非常少,浏览器会接收完整的html渲染.所以这种方式可以有效地提高FP, FCP, FMP的时间,并且由于js功能较少,对于TTI的时间提升也很有帮助;
因为页面数量是有限的,所以HTML都会预先渲染好,服务端基本上不需要其他的操作,对于减少TTFB.
{% asset_img 03.png %}
这种方式通常用于博客或者运营推广的页面.


## 服务器渲染
服务器渲染与静态渲染类似,都是将完整的html传给浏览器.区别是服务器可以根据参数或者cookie对html进行一些修改,达到同一个请求,结果具有差异化的目的.由于这种方式需要经过服务端处理一遍,所以会增加TTFB的时间.其他时间与静态渲染一致.
{% asset_img 04.png %}
jsp与php等使用的就是这种方式

## 客户端渲染
客户端渲染则是将渲染移交到浏览器,服务器只提供一个html壳,浏览器下载远程js及css后,根据逻辑渲染页面.由于这种方式从服务器返回的html只有最基础的壳,所以TTFB会非常少,但是还要单独去请求css与js,所以增加的RRT的开销.并且由于前端代码越来越复杂,如果没有处理好,还会增加FTP及TTI的时间.
{% asset_img 05.png %}

## 混合渲染
这种模式通常被称为SSR(Server-Side Rendering),页面中第一屏主要的内容由服务端渲染,后续的操作移交给客户端渲染,这种方式由于第一屏的主要内容在服务端拼接好了HTML,传给客户端,所以增加了TTFB的时间,但是大大减少了FCP的时间.总体到FCP的时间相比于客户端渲染会缩短一些,但是后续操作由于还需要加载更多的js才能操作,所以TTI不一定会减少,可能会造成一些欺骗性;
{% asset_img 06.png %}
比如Next,Nuxt都是用的混合渲染方式.

## 流服务器渲染
最近几年,服务端渲染还在一些更好的办法,比如流式渲染,首先渲染用户可见范围的的所有功能,然后逐步渲染一些不可见的内容.React也推出了[renderToNodeStream](https://reactjs.org/docs/react-dom-server.html#rendertonodestream)等api用于处理流式渲染.

# 最后
不同的渲染方式有不同的优点和缺点,没有一个绝对的方式可以用于所有场景.下面是对渲染方式差异的表格,以供参考:
{% asset_img 07.png %}

# 参考
[Rendering on the Web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)
[以用户为中心的性能指标](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics)