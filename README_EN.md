# Baidu Cloud Function Compute

Baidu Cloud Function Compute Component ⎯⎯⎯ The easiest way to develop & deploy Baidu CFC Functions, powered by [Serverless Components](https://github.com/serverless/components).


## 1. Install

Install the latest version of the Serverless Framework:

```
$ npm install -g serverless
```

## 2. Create

You can easily create a new baidu-cfc function just by using the following command and template url.

```
$ serverless create --template-url  https://github.com/baidubce/cfc-serverless-component/tree/master/templates/cfc
$ cd cfc
```
Then, create a new .env file in the root of the cfc directory right next to serverless.yml, and add your Baidu Cloud access keys:

```
# .env
BAIDU_ACCESS_KEY_ID='Your access key id'
BAIDU_SECRET_ACCESS_KEY='Your secret access key'
```

You should now have a directory that looks something like this:

```
|- src
  |- index.js
|- serverless.yml
|- .env
```

## 3. Configure

Here's a complete reference of the `serverless.yml` file for the `baidu-cfc` component:

```
# serverless.yml
myFunction:
  component: "@baiducloud/cfc-serverless-component"
  inputs:
    name: cfc-serverless-nodejs # (required)
    src: ./src  # (optional) path to the source folder.
    handler: index.handler # (optional) cfc handler. default is index.handler.
    runtime: nodejs10 #(optional) cfc runtime. default is nodejs10.
    region: bj # (optional) region, default bj
    description: My Serverless Function
    memorySize: 128
    timeout: 3
    logType:  # (optional)
    logBosDir: #(optional)
    environment:
      variables:
        kue1: value
    publish: false
    bosBucket: #(optional) Bos bucket
    bosObject: #(optional) Bos object
    sourceTag: #(optional) source tag
    deadLetterTopic: #(optional) dead letter topic
    vpcConfig:
      vpcId: # (optional)
      subnetIds: #(optional)
      securityGroupIds: #(optional)
    exclude:
      - .gitignore
      - .git/**
      - node_modules/**
      - .serverless
      - .env
    include:
      - ./func.zip
```

## 4. Deploy

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

## Remove

```
$ serverless remove --debug

  DEBUG ─ Flushing template state and removing all components.
  Removing function cfc-serverless-nodejs from the bj region.
  Successfully removed function cfc-serverless-nodejs from the bj region.

  2s › myFunction › done
```

## Running the tests

Testing CFC Component. First, add Baidu Cloud's AK and SK to the .env file in the test directory. Then execute the command($ sls --debug) in the test directory to deployment a function. After the deployment is successful, you can view the newly created function in the function list of Baidu Cloud Function Computing Console. Finally execute the command($ sls remove --debug) to remove the function.

## Discussion

Baidu Ruliu Discussion Group: 3040017
