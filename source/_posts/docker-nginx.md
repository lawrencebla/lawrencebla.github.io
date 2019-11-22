---
title: 通过docker创建本地nginx环境
date: 2019-09-12
tags:
  - docker
  - nginx
---

使用docker，1分钟创建本地Nginx环境
<!-- more -->

如果本地不想安装Nginx环境，又想使用其中的功能或测试，可以通过docker-compose来维护本地nginx环境。

**需要安装docker**

## 快速启动

在需要记录nginx映射的地方，创建docker-compose.yml，如下：

``` yml
version: "3"
services:
  nginx1:
    image: nginx
    ports:
     - "8761:80"
  nginx2:    
    image: nginx
    ports:
     - "8762:80"
```

同时创建并启动2个服务：
``` bash
docker-compose up -d
```

可以在控制台看到已经创建成功
```
Creating network "nginx_default" with the default driver
Creating nginx_nginx1_1 ... done
Creating nginx_nginx2_1 ... done
```

这时就可以分别通过`8761`和`8762`端口，看到nginx1和nginx2创建的默认页面。

## 配置

### version
定义compose版本，目前有1、2、3，3个大版本，不写默认 version 1，支持的功能比较少。上面的配置中，至少需要version 2；简易使用version 3便于拓展。

version 1配置
``` yml
nginx1:
  image: nginx
  ports:
    - "8761:80"
nginx2:    
  image: nginx
  ports:
    - "8762:80"
```
[不同version之间的比较](https://docs.docker.com/compose/compose-file/compose-versioning/)


### services
每个容器的配置, nginx1、nginx2为相关容器名。
* image: 创建容器时，基于的镜像，这里基于nginx镜像;
* ports: 将容器内的端口号映射到容器外的端口号，这里是将nginx的80端口映射到外部的8761端口;
* volumes: 需要将本地文件映射到容器内部时，可以使用volumes功能，格式为`local_path:container_path`;

完整配置如下:
``` yml
version: "3"
services:
  nginx1:
    image: nginx
    volumes:
     - ./nginx1/conf:/etc/nginx
     - ./nginx1/html:/usr/share/nginx/html
    ports:
     - "8761:80"
  nginx2:    
    image: nginx
    ports:
     - "8762:80"
```
nginx容器内部文件地址及容器详情可参考[这里](https://hub.docker.com/_/nginx)。

具体volumes相关信息可参考[这里](https://docs.docker.com/storage/volumes/)。

## 命令

### docker-compose up [options] [--scale SERVICE=NUM...] [SERVICE...]
创建并启动容器，可指定目标容器，不指定时启动所有配置中的容器。

* -d: 默认是在前台运行，结束后容器停止；使用-d命令后台运行;
* SERVICE: 指定目标容器，如`docker-compose up -d nginx1`;

[完整配置](https://docs.docker.com/compose/reference/up/)

### docker-compose down
停止并删除容器
```
Stopping nginx_nginx1_1 ... done
Stopping nginx_nginx2_1 ... done
Removing nginx_nginx1_1 ... done
Removing nginx_nginx2_1 ... done
Removing network nginx_default
```

### docker-compose start
已停止且未被删除的容器
```
Starting nginx1 ... done
Starting nginx2 ... done
```

### docker-compose stop
停止已启动的容器
```
Stopping nginx_nginx1_1 ... done
Stopping nginx_nginx2_1 ... done
```

### docker-compose ps
列出相关的容器
```
     Name              Command          State          Ports
--------------------------------------------------------------------
nginx_nginx1_1   nginx -g daemon off;   Up      0.0.0.0:8761->80/tcp
nginx_nginx2_1   nginx -g daemon off;   Up      0.0.0.0:8762->80/tcp
```
```
     Name              Command          State    Ports
------------------------------------------------------
nginx_nginx1_1   nginx -g daemon off;   Exit 0
nginx_nginx2_1   nginx -g daemon off;   Exit 0
```