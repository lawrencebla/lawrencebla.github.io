# 资深js开发需要知道的10件事

**Refrence**

> https://benmccormick.org/2017/07/19/ten-things-javascript/

## 引子

在Reddit上有个po主问：大家觉得一个好的js开发者需要知道哪10件事情:

[“What 10 Things Should a Serious Javascript Developer Know Right Now?”](https://www.reddit.com/r/javascript/comments/6mlc9d/what_10_things_should_a_serious_javascript/)


我认为我们不能仅仅因为一个jser不了解哪些时髦的js库或者用了一些看起来很古老的编辑器就认为他不是高级开发。

首先，我不会在这里讨论关于沟通能力，版本控制，专业素养以及基本代码问题，虽然这些也都非常重要，但是并不在我们这次讨论的范畴里;
此外我们讨论的是前端开发，并不包括服务端的开发。

## 10件事：
1. 你应该知道语言的核心

js上，新的框架和库，宿主环境有太多东西要去学习，但是实际上js的核心却没有多少，这些东西大部分都是基于核心做不同的轮子。
所以我们应该去理解语言的核心内容，如判断、错误、数组、字符串的等原生API；
同时还需要js处理事情的逻辑，json字符串如何转成对象，作用域、以及最近新出来的es6相关内容。
因为如果你不了解这些，很难从别人的代码中获取好的知识。

关于语言核心，你可以看下[JavaScript编程精解](https://www.amazon.cn/%E5%9B%BE%E4%B9%A6/dp/B018275LEM/ref=sr_1_1?ie=UTF8&qid=1501660901&sr=8-1&keywords=JavaScript%E7%BC%96%E7%A8%8B%E7%B2%BE%E8%A7%A3);
对于跟随js新的feature，可以看[How to follow the JavaScript roadmap](https://benmccormick.org/2017/07/10/how-to-follow-the-javascript-roadmap/)

2. 你应该理解async代码

减少callback和promises，总之很厉害就是了，需要理解。

3. 你应该有一个好用的开发者工具

好的工具会帮你更好的调查问题以及检查代码，但是大部分还是用浏览器的工具，需要知道怎么使用它进行调试。

4. 你应该精通函数

函数是Js的核心，所以要理解函数作用域、闭包、this、箭头函数和普通函数的区别，这也就意味着要了解数组的函数式回调。

可以参考[JavaScript Allonge](https://leanpub.com/javascriptallongesix/read)

5. 你应该懂得一些基本的设计

如果你没有一些基本的设计，你的职业发展将会受限，除非你是一个纯服务端开发。
在你的开发生涯中，你应该遇到过几次设计人员没时间给设计的情况或者设计不明确的情况；
懂得一些设计将会让你与设计师、产品经理更好的讨论技术的限制与设计上的需求。

关于设计,首先可以看下[White Space is Not Your Enemy](http://amzn.to/2uz3vEG)；当你需要UX相关的资源，可以查阅[Don’t Make Me Think](http://amzn.to/2uvUrR7)

6. 你要有一些基本的网络知识

你应该在脑海中有个大概的印象，当有人在浏览器上输入URL后，发生了什么。
你应该知道REST的概念，有助于你调用其他网站的API，如[推特](https://dev.twitter.com/rest/public)、[Github](https://developer.github.com/v3/)。

7. 你应该尽量用基于nodejs的工具

JS的世界里，每隔5年都有一次大的变动以及更好用的工具出现，这些工具如babel、typescript和webpack本质上都是工作流程改变的体现，
所以虽然你不需要有nodejs的经验，但是你要会用这些工具，主要是npm的生态。

8. 你应该知道如何用一个框架去编写一个中等大小的程序

这需要有个整体的架构思想，可以写出一个更易于维护的代码；同时也能帮你发现现有架构的问题，
选择一个框架至少要有2个框架体系的支持，这样你才可以比较出是否合适。
这条虽然有争议，但是一个有框架经验的人肯定是更适合去完成任务。

9. 你应该知道js的性能问题

这个问题同设计一样可以讲的很深，一个基本的需求是，你需要知道怎么样去调试一个很慢的问题并知道什么原因引起的。
你需要知道哪里会影响解析速度，哪里影响运行速度，哪里影响网络延迟；
避免大量计算导致的UI响应延迟

10. 你应该不断学习新的知识

js开发在近10年改变极大，js的麾下有越来越多的技术，没有人可以永远保持领先，所以我们需要不断跟随这些新的技术，当需要时我们可以尽快的学习它。
所以你需要找到一个可以让你了解新技术的地方，如推特，博客，新闻社区去Reddit或者极客新闻。
如果你想找一个更简单的方式，我推荐[jsweeekly](http://javascriptweekly.com/)。

善用Google，善用Stack Overflow