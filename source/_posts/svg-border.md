---
title: svg：使用stroke-dasharray和stroke-dashoffset实现动态边框
date: 2020-03-14
tags:
---
因为某些原因，需要用svg做一个动态的边框，如下：

![final](https://github.com/lawrencebla/lawrencebla.github.io/raw/site/source/_posts/svg-border/final.gif)
<!-- more -->
首先画2个长方形重叠，使用**stroke-dasharray**属性，设置dash的线长和空白长度:
``` html
<rect x="0" y="0" width="200" height="40" fill="none" stroke="gray"/>
<rect x="0" y="0" width="200" height="40" fill="none" stroke="red" stroke-dasharray="100 380"/>
```
![step1](https://github.com/lawrencebla/lawrencebla.github.io/raw/site/source/_posts/svg-border/step1.png)

添加**animate**，控制**stroke-dashoffset**属性的修改，并设置对应的**from**、**to**、**dur**和**repeatCount**属性；
``` html
<animate attributeName="stroke-dashoffset" from="480" to="0" dur="3s" repeatCount="indefinite" />
```

### 最终代码：
``` html
<rect x="0" y="0" width="200" height="40" fill="none" stroke="gray"/>
<rect x="0" y="0" width="200" height="40" fill="none" stroke="red" stroke-dasharray="100 380">
  <animate attributeName="stroke-dashoffset" from="480" to="0" dur="3s" repeatCount="indefinite" />
</rect>
```
![final](https://github.com/lawrencebla/lawrencebla.github.io/raw/site/source/_posts/svg-border/final.gif)
