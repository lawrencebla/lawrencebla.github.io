---
title: Promise、Generator与Async
tags:
---

Promise到底是解决了什么问题？这也是在面试的时候，经常会碰到的一个题目。一些人第一反应就是，为了解决地狱回调，增强可读性；网上搜出来的结果也都是已这个为主。抛开这个原因，还有其他的优势么？
<!-- more --> 

先看看常见的说法，地狱回调
```js
a(function b() {
  // do something
  function c() {   
    // do something 
    function d() {
    // do something 
    }
  }
})
```
其实这种是不良的使用方式而已，用promise也可以写成这样
```js
Promise()
.then(() => {
  a(function b() {
    // do something
    function c() {   
      // do something 
      function d() {
      // do something 
      }
    }
  })
})
```
但是为什么大部分都是下面这种写法？
```js
Promise(a).then(b).then(c).then(d)
```
因为当我们用promise的时候，就被教导说，要这么写；实际上对于地狱回调，写法也应该是
```js
a(b(c(d)))
```
甚至更优雅的写法应该是类似：
```js
compose(a, b, c, d)()
```

这么看来，Promise并没有在地狱回调上有明显的优势。那Promise到底是解决了什么问题？先来看下面一个例子：

在ajax中，如果需要对pending的请求做优化：在请求响应回来之前，不触发多次，但在响应后需要触发每次请求的回调事件。

* 用回调的方式实现(jquery举例子)
```js
let callbacks = {}
function get(url, callback) {
  (callbacks[url] = callbacks[url] || []).push(callback)
  $.get(url, {
    success: function(res) {
      callbacks[url].forEach(cb => cb(res))
      callbacks[url] = undefined
    }
  })
}
```

* 用Promise的方式实现
```js
let pendingRequest = {}
function get(url) {
  return pendingRequest[url] || (pendingRequest[url] = fetch(url).then((res) => {
    pendingRequest[url] = undefined
    return res
  }))
}
```
这里可以明显看出来，Promise将一个未来的概念变为一个实体变量，将未来值具现，并由外部对其进行操作。也正是因为这个特点，可以开发出很多的区别与回调的特性：
1. 把promise交给其他人操作
2. promise可以的组合
```js
Promise.all([p1, p2])
Promise.race([p1, p2])
```
3. promise在then之后还可以组合
```js
Promise.all([p1, p2.then(...)])
Promise.race([p1, p2.then(...)])
```

那Generator出现的原因又是什么呢？先看下如下代码
```js
function *taskGenerator() {
  yield task1();
  yield task2();
  yield task3();
}
const task = taskGenerator()
// 执行task1
task.next()
// 执行task2
task.next()
// 执行task3
task.next()
```
从上面的例子中可以看出，Generator具有暂停函数的能力，只有调用next方法时，才会指定yield的内容，这个功能是promise无法做到的。这样做的好处在于，Generator内部只需将和自己相关的逻辑定义好，而执行权反转给调用者，让代码的业务逻辑可以分离的更彻底，也更连贯。

滚动加载的例子
```js
function getList() {
  let start = 0
  return fetch(start)
    .then(() => {
      // 更新start
    })
}
// 获取第一页
getList()
// 获取第二页
getList()

function *getListGenerator() {
  let start = 0
  while(true) {
    start = yield fetch(start)
  }
}

const list = getListGenerator()
let res = []
// 获取第一页
res = res.concat(list.next(res.length))
// 获取第二页
res = res.concat(list.next(res.length))
```
通过Promise去设置的start的方法被包装在方法内部，不能改动，包含业务逻辑
通过Generator在调用者去设置start，一个Generator可以在不同业务场景处，设置不同的start逻辑

```js
new Promise(resolve => {
  resolve()
})
.then(task1)
.then(task2)
.then(task3)

function *task() {
  //... some code 1
  var val1 = yield task1();
  //... some code 2
  var val2 = yield task2(val1);
  //... some code 3
  var val3 = yield task3(val2);
}

```
将执行权做了更合理的转移，函数内部只定义自己的相关的内容

async的出现只是单纯的为了让promise更好看
