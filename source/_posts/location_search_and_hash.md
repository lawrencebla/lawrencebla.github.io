---
title: location的search(?)与hash(#)顺序
date: 2020-03-04
---
location中的search和hash会被经常使用到，但是对应的顺序一定要保证。
<!-- more -->

**search**一定要在**hash**之前，不然会出现取值错误问题，如：
```
https://abc.com?a#b
```
* search: '?a'
* hash: '#b'

```
https://abc.com#a?b
```
* search: ''
* hash: '#a?b'

_由于search和hash同时出现的频率不高，并且单页应用使用hash路由时，可能会忽略这个问题，所以需要特别注意。_
