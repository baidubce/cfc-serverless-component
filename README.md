# 百度云函数计算CFC组件

## 简介

通过百度云函数计算CFC组件，可以快速，方便的创建、配置和管理百度云CFC云函数。

## 快速开始

### 1. 安装

通过npm安装最新版本的serverless framework。

```
$ npm install -g serverless
```

### 2. 创建

可以通过现有的cfc template创建CFC函数

```
$ serverless create --template-url  https://github.com/baidubce/cfc-serverless-component/tree/master/templates/cfc
$ cd cfc
```

然后在根目录中的.env文件，添加百度云的AK, SK

```
# .env
BAIDU_ACCESS_KEY_ID='Your access key id'
BAIDU_SECRET_ACCESS_KEY='Your secret access key'
```

创建完成后的文件目录结构如下：

```
|- src
  |- index.js
|- serverless.yml
|- .env
```

### 3. 配置

可以通过修改本地文件夹中的serverless.yml文件修改函数配置

```
# serverless.yml
myFunction:
  component: "@baiducloud/cfc-serverless-component"
  inputs:
    name: cfc-serverless-nodejs #必须
    src: ./src  #code存放路径
    handler: index.handler #函数入口
    runtime: nodejs10 #运行时
    region: bj #地域
    description: My Serverless Function
    memorySize: 128
    timeout: 3
    logType:  #日志存储类型
    logBosDir: #日志存储路径
    environment:
      variables:
        kue1: value
    publish: false
    bosBucket: #若要从bos上传代码，代码存储的Bos bucket
    bosObject: #若要从bos上传代码，代码在bos中的object
    sourceTag: #区分CFC函数和小程序云函数
    deadLetterTopic: #死信队列topic
    vpcConfig:
      vpcId: #要绑定的VpcID
      subnetIds: #要绑定的子网列表
      securityGroupIds: #要绑定的安全组列表
    exclude:
      - .gitignore
      - .git/**
      - node_modules/**
      - .serverless
      - .env
    include:
      - ./func.zip
```

### 4. 部署

通过serverless命令进行部署，并且可以添加--debug查看部署过程中的信息。

```
$ serverless --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  Starting deploy cfc component...
  deploy function...
  successfully deploy a function.

  myFunction:
    outpout:
      FunctionName: cfc-serverless-nodejs
      Runtime:      nodejs10
      Handler:      index.handler
      MemorySize:   128
      Timeout:      3
      Region:       bj
      Description:  My Serverless Function
      FunctionBrn:  brn:bce:cfc:bj:************************:function:cfc-serverless-nodejs:$LATEST
      CodeSha256:   vRGl9SOWu1fxbq3PjAxZgRJdksDn8SnqNt7eBGMHAOk=
      SourceTag:

  2s › myFunction › done
```

### 5. 移除

可以通过serverless remove移除部署的函数

```
$ serverless remove --debug

  DEBUG ─ Flushing template state and removing all components.
  Removing function cfc-serverless-nodejs from the bj region.
  Successfully removed function cfc-serverless-nodejs from the bj region.

  2s › myFunction › done
```
## 6. 测试

测试CFC Component组件，在test目录下的.env文件中添加百度云的AK、SK, 然后在test目录下执行$ sls deploy --debug部署函数, 部署成功后, 可以在百度云函数计算控制台函数列表中查看新建函数。最后执行$ sls remove --debug命令删除函数

## 7. 讨论

百度如流讨论群: 3040017
