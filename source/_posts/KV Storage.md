---
title: KV Storage
date: 2019-11-01
tags:
  - new feature
---

# KV Storage
Chrome正在试验一种称为内置模块的新功能，而我们计划推出的第一个功能是称为KV Storage的异步键/值存储模块。推出主要`KV Storage`原因是`localStorage`无法满足特定环境中，对于前端持久化存储的需求。
<!-- more --> 

## localStorage的问题
1. localStorage实际上是有存储大小限制的（Chrome通常为5M），但是代码中无法简单的获取存储空间是否已满。
2. localStorage是同步操作，会阻塞浏览器渲染，如果写入大数据，会造成页面卡顿。
3. 在开发者本地环境，可能会有系统缓存数据，所以存储很快，但是用户环境却可能很慢，影响用户体验，却又很难调查。
4. 当网站写入localStorage后，如果代码不主动删除，这些数据会一直存在；当页面调用localStorage时，浏览器会把所有的数据都读取到内存中，如果开的tab过多，并且localStorage很大，就会占用很多内存空间。
5. localStorage的数据写入到磁盘中，IO性能差。

## 内置模块
跟随浏览器，与传统Web API不同，内置模块不会在全局范围公开，只能通过导入获得， std开头，如`import storage from 'std:kv-storage';`。这么做优点是，功能不跟随tab启动，避免非必要的性能消耗。

## 使用
KV Storage具有get()、set()、delete()方法，key可以是非字符串；由于KV Storage是异步的，所以返回值是Promise。
实例代码：
```javascript
import storage from 'std:kv-storage';

const main = async () => {
  const oldPreferences = await storage.get('preferences');

  document.querySelector('form').addEventListener('submit', async () => {
    const newPreferences = Object.assign({}, oldPreferences, {
      // Updated preferences go here...
    });

    await storage.set('preferences', newPreferences);
  });
};

main();
```

**Chrome的版本必须大于74并开启实验功能(chrome://flags/#enable-experimental-web-platform-features)**

[Demo](https://rollup-built-in-modules.glitch.me/)

# 参考
[KV Storage: the Web's First Built-in Module](https://developers.google.com/web/updates/2019/03/kv-storage)
[There is no simple solution for local storage](https://hacks.mozilla.org/2012/03/there-is-no-simple-solution-for-local-storage/)