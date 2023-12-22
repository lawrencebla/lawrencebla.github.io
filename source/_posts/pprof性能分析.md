---
title: k8s中的pprof性能分析
date: 2023-12-22 17:58:55
tags: 
    - k8s
    - golang
---
使用pprof对k8s中的项目性能分析。
<!-- more --> 
# pprof
首先需要了解go的pprof如何使用，根据官方文档中提供的资料，pprof可以采样如下指标：
* cmdline: 当前程序的命令行的完整调用路径
* profile: 默认进行 30s 的 CPU Profiling，得到一个分析用的 profile 文件
* symbol: 暂无明确资料
* trace: 获取trace文件，通过go tool trace命令查看
* allocs: 查看过去所有内存分配的样本
* block: 查看导致阻塞同步的堆栈跟踪
* goroutine: 查看当前所有运行的 goroutines 堆栈跟踪
* heap: 查看活动对象的内存分配情况
* mutex: 查看导致互斥锁的竞争持有者的堆栈跟踪
* threadcreate: 查看创建新 OS 线程的堆栈跟踪

## 采样
官方和社区提供了多种不同的采样方式，介绍主要使用的几种。

### runtime/pprof
代码调用**runtime/pprof**库内置方法生成和写入采样文件，获取一次性执行程序的性能。
* 获取CPU数据
```go
import _ "runtime/pprof"
func main() {
    // 配置写入文件并启动CPU Profile
    pprof.StartCPUProfile(file)
    // 写入数据
    defer pprof.StopCPUProfile()
}
```
* 获取内存数据
```go
import _ "runtime/pprof"
func main() {
    pprof.WriteHeapProfile(file)
}
```

### net/http/pprof
提供 http 服务获取采样文件，简单易用，代码改动小
```go
import _ "net/http/pprof"
func main() {
    pprofRouter.GET("/", pprof.Index)
    pprofRouter.GET("/cmdline", pprof.Cmdline)
    pprofRouter.GET("/profile", pprof.Profile)
    pprofRouter.POST("/symbol", pprof.Symbol)
    pprofRouter.GET("/symbol", pprof.Symbol)
    pprofRouter.GET("/trace", pprof.Trace)
    pprofRouter.GET("/allocs", pprof.Handler("allocs").ServeHTTP)
    pprofRouter.GET("/block", pprof.Handler("block").ServeHTTP)
    pprofRouter.GET("/goroutine", pprof.Handler("goroutine").ServeHTTP)
    pprofRouter.GET("/heap", pprof.Handler("heap").ServeHTTP)
    pprofRouter.GET("/mutex", pprof.Handler("mutex").ServeHTTP)
    pprofRouter.GET("/threadcreate", pprof.Handler("threadcreate").ServeHTTP)
}
```
通过端口启动后，可以直接通过url访问
{% asset_img 01.png %}

也可通过**go tool pprof**或其他第三方工具下载文件并本地解析

### go test -bench
如果已经写好性能测试，可以直接通过**go test -bench**命令生成采样文件
```go
go test -bench . -benchmem -cpu profile prof.cpu
```

### 第三方库
社区中也有第三方库，支持更多更好用的功能，如:
* gin-contrib/pprof：gin pprof中间件
* pkg/profile：runtime/pprof的进阶

## go tool pprof
性能采样数据在网页端较难直接进行分析，go tool提供了相关命令可以对在线/本地文件进行更进一步的性能分析

下面命令可以下载采样数据并进入分析交互模式：
```go
go tool pprof <pprof_url>
```

### 内存分析
通过/pprof/heap进入内存分析交互，执行**top N**打印内存占用最多函数
{% asset_img 02.png %}

通过**list**命令查看具体出错位置
{% asset_img 03.png %}

### 网页访问
go tool pprof交互命令较多，并且不容易查看分析，故提供了网页打开方式，比纯net/http/pprof的web形式更易用，同样支持本地文件和网络文件

如：分析本地内存文件并打开8888端口
```go
go tool pprof -http :8888 /root/pprof/pprof.alloc_objects.alloc_space.inuse_objects.inuse_space.001.pb.gz
```
网页中的VIEW菜单和交互命令大部分一一对应，可以通过菜单更详细的分析性能

#### Top
查找使用最高的功能
{% asset_img 04.png %}
#### Graph
默认页面，可以更直观的看到资源占用及父子关系
{% asset_img 05.png %}
#### Flame Graph
火焰图，另从一种方式查看资源及关系
{% asset_img 06.png %}
#### Peek
相对于**Top**更详细的上下文
{% asset_img 07.png %}
#### Source
资源累计使用显示到具体行号
{% asset_img 08.png %}

## go tool trace
有时候还需要看到程序运行时的信息追踪，可以通过pprof的交互命令traces来查看，同样go tool也提供更便捷的web查看方式
```go
// 先通过url下载trace文件至本地，?seconds=10参数可以下载10秒内
go tool trace <trace_ile>
```
{% asset_img 09.png %}

页面中主要包含**trace**、**goroutine**、**网络io**、**同步阻塞**、**阻塞中的系统调用**、**计划任务**等待等分析
### goroutine
可以从goroutine作为入口开始，查看每个函数有多少个goroutine在跑，点击函数名可以进入详情页
{% asset_img 10.png %}
{% asset_img 11.png %}

在详情页可以分别进入**网络io**、**同步阻塞**、**阻塞中的系统调用**、**计划任务**及**trace页面**

**网络io**、**同步阻塞**、**阻塞中的系统调用**、**计划任务**中，分别可以看到相关的调用耗时及上下文关系
{% asset_img 12.png %}

### trace
trace中可以从时间轴上，总览相关数据火焰图，并可点击相关goroutine查看相关事件来源
{% asset_img 13.png %}

# k8s中使用
k8s中的项目一般是单service多pod形式，并且对外只会暴露一个service端口，无法更细致的观察到每个pod的性能使用。

因此需增加代理应用获取指标，并鉴权后直接提供网页分析形式：
{% asset_img 14.png %}