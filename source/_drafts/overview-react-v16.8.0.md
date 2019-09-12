---
title: （概览） React v16.8 The One With Hooks
tags: 
  - 概览
  - React Blog
---

React Hooks将于React 16.8版本正式发布。
<!-- more --> 

[原文](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html)

Introducing Hooks explains why we’re adding Hooks to React.
Hooks at a Glance is a fast-paced overview of the built-in Hooks.
Building Your Own Hooks demonstrates code reuse with custom Hooks.
Making Sense of React Hooks explores the new possibilities unlocked by Hooks.
useHooks.com showcases community-maintained Hooks recipes and demos.

React Native将在0.59版本发布

React DOM
React DOM Server
React Test Renderer
React Shallow Renderer
都需要升级到最新

react hooks lint: [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

[examples](https://codesandbox.io/react-hooks)

[Hooks RFC](https://github.com/reactjs/rfcs/blob/master/text/0068-react-hooks.md)

``` sh
# npm
npm install eslint-plugin-react-hooks@next --save-dev

# yarn
yarn add eslint-plugin-react-hooks@next --dev
```
``` json
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error"
  }
}
```
Create React App创建的项目，需要等下个版本的react-scripts加入这个规则