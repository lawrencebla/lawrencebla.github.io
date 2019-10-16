---
title: 使用github actions发布hexo
date: 2019-09-16 18:35:05
tags:
  - github actions
  - hexo
---

使用gitHub的actions，自动构建hexo博客至github page。
<!-- more -->

github最近加入actions新功能，可以针对github中的仓库添加钩子，进行一系列的操作。功能覆盖比较全面，基本的CI将不在依赖于jenkins。

## 添加workflows
github提供了非常多的actions实例，集成了市面上大部分的环境，开箱即用[市场](https://github.com/marketplace?type=actions)；与此同时，[官方](https://github.com/actions/starter-workflows)也提供了许多基础模板以供使用。

1. hexo是基于nodejs，并且功能简单，所以选择官方的[nodejs模板](https://github.com/actions/starter-workflows/blob/master/ci/node.js.yml)。
2. 由于github actions提供`GITHUB_TOKEN`内置环境变量，不会触发github page的build；所以[添加自定义token](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables)；
3. 添加基于token的remote
```
https://x-access-token:${my_github_token}@github.com/${GITHUB_REPOSITORY}.git
```

详情可见[nodejs.yml文件](https://github.com/lawrencebla/lawrencebla.github.io/blob/gh-actions-hexo/.github/workflows/nodejs.yml)。

