# Eslint集成Typescript提示React代码

最近在做一个React项目，加入了Typescript语法，但是由于Vscode的Tslint只能处理纯ts语法的问题，无法集成之前编码习惯的Eslint；所以在网上找了些方法，使Eslint可以集成Typescript的Lint，在这里总结一下。

*前提：基于已有的Eslint、React以及Typescript环境。*

## 添加Eslint的Typescript插件

1. 安装

```yarn add --dev typescript-eslint-parser```

2. 配置

在原Eslint的配置中添加：

```parser: 'typescript-eslint-parser',```

## 添加typescript-eslint-parser插件

1. 安装

```yarn add --dev eslint-plugin-typescript```

2. 配置

在原Eslint的配置的plugins中添加typescript，如我这里的是

```
"plugins": [
  "react",
  "react-native",
  "typescript"
],
```

## 其他配置

### Vscode添加typescript的自动提示

在 首选项 -> 设置 中，找到eslint.validate，加入typescript与typescriptreact，分别用于监听ts与tsx文件，如下
```
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
]
```

### 接口提示未定义

在rules中取消该配置，ts会自行判断并提示

```"no-undef": 0```

### 类及接口驼峰提示（个人建议）

在rules中添加

```"typescript/class-name-casing": 2```


## 参考

[typescript-tutorial: eslint](https://github.com/xcatliu/typescript-tutorial/blob/master/ecosystem/eslint.md)

[eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy)

[typescript-eslint-parser](https://github.com/eslint/typescript-eslint-parser)

[eslint-plugin-typescript](https://github.com/nzakas/eslint-plugin-typescript)

## 我的完整配置

```
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": [
    "react",
    "react-native",
    "typescript"
  ],
  "parser": "typescript-eslint-parser",
  "env": {
    "es6": true,
    "browser": true,
    "node": true,
    "react-native/react-native": true
  },
  "rules": {
    "no-tabs": 2,
    "quotes": [2, "single", { "allowTemplateLiterals": true }],
    "jsx-quotes": [2, "prefer-single"],
    "eqeqeq": 2,
    "no-undef": 0,
    "typescript/class-name-casing": 2
  },
  "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module",
      "ecmaFeatures": {
          "jsx": true
      }
  }
}
```
