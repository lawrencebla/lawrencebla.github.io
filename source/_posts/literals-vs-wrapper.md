---
title: 字面量与包装对象
date: 2020-05-08
tags:
  - JS Core
---
# 案例
先看3个例子
```js
let a = 'str'
a.toString = () => 1
a.toString() // str
```
```js
let b = new String('str')
b.toString = () => 1
b.toString() // 1
```
```js
let c = String('str')
c.toString = () => 1
c.toString() // str
```

<!-- more --> 

# 分析
首先观察前2个例子可以很明显看到区别，第一个是字符串，第二个是字符串对象：
```js
typeof a // string
```
```js
typeof b // object
```
那么看看在[ECMA](http://www.ecma-international.org/ecma-262/6.0/#sec-getv)上的描述：
>The abstract operation GetV is used to retrieve the value of a specific property of an ECMAScript language value. If the value is not an object, the property lookup is performed using a wrapper object appropriate for the type of the value. The operation is called with arguments V and P where V is the value and P is the property key. This abstract operation performs the following steps:
>1. Assert: IsPropertyKey(P) is true.
>2. Let O be ToObject(V).
>3. ReturnIfAbrupt(O).
>4. Return O.[[Get]](P, V).

这里描述的比较清楚: 如果被取属性的值**不是**`object`类型，会使用一个适合该类型的**包装对象**进行转换，然后对转换后的`O`进行取值，而不是对原始字面量进行操作。所以**不管如何修改非对象的属性，都不会生效。**

接下来再看看`c`的类型：
```js
typeof c // string
```
继续查阅[ECMA](http://www.ecma-international.org/ecma-262/6.0/#sec-string-constructor)文档，里面是这么描述String调用的：
>The String constructor is the %String% intrinsic object and the initial value of the String property of the global object. When called as a constructor it creates and initializes a new String object. When String is called as a function rather than as a constructor, it performs a type conversion.

也就是说，只做一个[ToString](http://www.ecma-international.org/ecma-262/6.0/#sec-tostring)的转换，如果传入的是字符传，会直接返回传入的参数。所以得到的结果还是string类型，获取属性时，也就不会生效。

# 最后
总结一点就是，不要轻易修改某个基本类型的属性，因为会不生效；如果需要对所有同类型的值加上/修改属性，可以在对应的**包装对象**原型链上修改，因为基本类型取属性都会先转换撑**包装对象**。
