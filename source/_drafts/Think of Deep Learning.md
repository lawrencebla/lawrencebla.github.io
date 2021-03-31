---
title: Think of Deep Learning
tags:
---

step

感知机
多个二进制输入产生一个二进制输出（引入权重，加权求和）
感知机除了和创建普通与非门以外的功能，更多的是，我们可以设计学习算法，自动调整权重和偏移

二层感知机
更加负责和抽象

阈值移动到权重同一边，则变成偏移量b（负阈值）
所以偏移量实际上表示的是感知器触发的难易程度


sigmoid（仅用于最后的输出么）

不断修正权重和偏移，观察最后的输出与结果的匹配度，调整出正确的权重和偏移
但是权重和偏移的调整会直接导致0、1之间的变化，从而引起后续的变化。
sigmoid输入的不再是0或1，而是0-1中间的任何值
方式是将加权并偏移后的值，传入sigmoid函数，算出最后的输入，而不是通过大于0之类的判断(step函数)
同时，偏导数更容易确定改变对于输出的影响趋势，指数形式区别于其他具有更好的偏导特性，所以sigmoid使用这种公式

损失函数求出最合适的w和b
MSE为什么要平方，因为w和b的小改动，很难对最后结果有改动

梯度下降
从代数层面求损失函数的最小值

求偏导的缺点
偏导数的计算次数为变量的平方

随机梯度下降
普通梯度下降样本过多时，计算慢
随机梯度下降，不严格准确，趋势正确

学习率