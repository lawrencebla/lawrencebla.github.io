---
title: Proxy与Reflect
date: 2018-10-11 09:42:59
tags:
---

Proxy与Reflect的简介与使用场景。
<!-- more --> 

Proxy与Reflect比较相似，每个Proxy的handler接口都有一个对应的Reflect的静态方法。

## 概念

### 官方（不用看）

* __Proxy__ 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。
* __Reflect__ 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与处理器对象的方法相同。Reflect不是一个函数对象，因此它是不可构造的。

### Proxy
在目标对象外，包装一层接口，__返回包装后的对象__。
``` js
let p = new Proxy(target, handler);
```
* target：需要包装的目标对象
* hander：接口定义。指定的操作被触发时，自动调用对应的接口。（如获取对象属性时，触发get。设置对象属性时，触发set）

使用时，__直接操作__ 包装后的对象 __p__。

``` js
// 完整例子
const target = {};

const p = new Proxy(target, {

    // 定义get接口。
    // target为目标对象，name为获取的key
    get: function(target, name) {
        // 不管访问什么属性，都会返回这个字符串
        return '通过get代理返回';
    },

    // 定义set接口。
    // target, name与get一致
    // value为设置的值，receiver为调用者，类似函数的this，但是比this更接近所有者（很少用）。
    set: function(target, name, value, receiver) {
        // 返回true表示设置成功
        console.log("属性: " + name + " 被设置为 " + value);
        return true;
    }

});

console.log(p.a); // 打印： '通过get代理返回'

p.a = 1; // 打印（set操作中）： "属性: a 被设置为 1"

console.log(p.a); // 打印（没有被修改，仍然返回get的值）： '通过get代理返回'
```
handler可以定义[13种接口](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)，大部分的情况，都是针对 __普通对象__ 进行代理，只有2个是用于针对 __函数类型__ 的接口。
* apply：target为函数，且target被调用时触发。
* construct：target为函数，且target被 __new__ 操作调用时触发（构造）。

### Reflect

实际上MDN对于Reflect的解释非常少。简单说就是对目标 __对象__ 的 __操作__ ，用另一种 __展示形式__ ，如：
``` js
const target = {
    a: 1,
};

// Reflect的get方法
Reflect.get(target, 'a'); // 1

// 等价与
target.a; // 1

// Reflect的set方法
Reflect.set(target, 'a', 2); // 2

// 等价与
target.a = 2; // 2

```
Reflect的[所有方法名](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)与Proxy的[handler](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)一致, 有13种，参数也基本相同。

## 可以做什么用

### Proxy
Proxy实际上可以做很多事，最常见的就是监听各种事件；其次是返回所需值；第三点就是篡改内容。

1. 监听事件，比如我要记录所有修改对象原型的操作。
``` js
const handler = {
    // 监听原型修改事件
    setPrototypeOf(target, newProto) {
        console.log(`对象原型被修改：${Object.keys(newProto).join('、')}`);
        return true;
    }
};

const p = new Proxy({}, handler);

Object.setPrototypeOf(p, {
    a: 1,
    b: 2,
}); // 对象原型被修改：a、b
```

2. 返回所需值，比如当获取属性RMB的时候，自动加上¥符号。
``` js
const handler = {
    // 修改返回值
    get(target, name) {
        return `¥${target[name]}`;
    }
};

const p = new Proxy({
    RMB: 1,
}, handler);

p.RMB // ¥1
```

3. 篡改内容， 比如我老婆永远都是18岁，那我把age改成任何数字，都是18岁。
``` js
const ageHandler = {
    // 篡改内容
    set(target, name, value) {
        target[name] = 18;
        return true;
    }
};

const wife = new Proxy({
    age: 18,
}, ageHandler);

wife.age = 20
console.log(wife.age) // 18
```

### Reflect
首先，使用Reflect最重要的一个原因就是：改变对象操作行为。原来我们修改、设置或者删除对象的一个值时，分别是：
``` js
console.log(obj.a);
obj.a = 1;
delete obj.a;
```
在Reflect中，从命令式变成了函数行为:
``` js
Reflect.get(obj, 'a');
Reflect.set(obj, 'a', 1);
Reflect.delete(obj, 'a');
```

其次，提供了一些命令式无法操作的功能，如__defineProperty__、__getOwnPropertyDescriptor__等。

最后，Proxy的每个__handler__接口，在Reflect中都有相同名称和参数的__静态方法__，所以如果需要在Proxy中进行默认操作，调用Reflect相同的接口名和参数即可。

在第一个Proxy的例子中，实际上并没有修改__p__的原型，进行如下修改即可：
``` js
const handler = {
    setPrototypeOf(target, newProto) {

        // 添加Reflect.setPrototypeOf修改原型
        Reflect.setPrototypeOf(target, newProto);

        console.log(`对象原型被修改：${Object.keys(newProto).join('、')}`);
        return true;
    }
};

const p = new Proxy({}, handler);

Object.setPrototypeOf(p, {
    a: 1,
    b: 2,
});

console.log(Reflect.getPrototypeOf(p)); // 打印：{a: 1, b: 2}
```

## 注意

* Proxy有2种创建方式，一种是通过new进行调用，另外一种使用静态方法：__revocable__ 进行调用，这种方式可以创建一个可撤销的代理对象，参数与new调用时一致，返回的对象包含代理对象 __proxy__ 和撤销回调 __revoke__。
``` js
var revocable = Proxy.revocable({}, {
  get(target, name) {
    return "[[" + name + "]]";
  }
});
var proxy = revocable.proxy;
proxy.foo;              // "[[foo]]"

revocable.revoke();     // 执行撤销方法

proxy.foo;              // TypeError
proxy.foo = 1           // 同样 TypeError
delete proxy.foo;       // 还是 TypeError
typeof proxy            // "object"，因为 typeof 不属于可代理操作
```
__Reflect不需要new，所有方法都是静态，直接使用。__

* Reflect的函数在Object与Function上也有相对的方法，如：
``` js
// getOwnPropertyDescriptor
Reflect.getOwnPropertyDescriptor();
// 等价与
Object.getOwnPropertyDescriptor();

// apply
Reflect.apply();
// 等价与
Function.prototype.apply();

// construct
Reflect.construct(fn);
// 等价与
new fn();
```
区别在于Reflect更严格，也会更合理；如Object上的方法会自动把第一个参数转换成Object类型，而Reflect不会；当输入值不符合规范时，Reflect会返回false，Object会报错或者自动转换。

## 参考文档：
https://zhuanlan.zhihu.com/p/24778807
http://es6.ruanyifeng.com/#docs/reference
https://github.com/tvcutsem/harmony-reflect/wiki
