// serverless.js
const DeployFunction = require('./src/deployFunction')
const RemoveFunction = require('./src/removeFunction')
const Package = require('./src/package')
const { Component } = require('@serverless/core')
const util = require('util')
const { prepareInputs } = require('./src/utils')


class BaiduCLoudFunction extends Component {
  /*
   * Default (必须)
   * - default 是用来执行、准备和更新你的组建的函数
   * - 执行命令 `$ serverless` 会运行此函数
   * - You can run this function by running the "$ serverless" command
   */
  async default(inputs = {}) {
      inputs = prepareInputs(inputs, this);
    this.credentials = {
      ak: process.env.BAIDU_ACCESS_KEY_ID,
      sk: process.env.BAIDU_SECRET_ACCESS_KEY
    }
    console.log('Starting deploy cfc component...')

    const cfc = new DeployFunction(this.credentials.ak, this.credentials.sk, inputs.region)

    if (!inputs.exclude) {
      inputs.exclude = []
    }
    if (!inputs.include) {
      inputs.include = []
    }

    const defaultExclude = ['.serverless', '.temp_env', '.git/**','.gitignore']

    for (let i = 0; i < defaultExclude.length; i++) {
      if (inputs.exclude.indexOf(defaultExclude[i]) == -1) {
        inputs.exclude.push(defaultExclude[i])
      }
    }

    const zipOutput = util.format('%s/%s.zip', this.context.instance.stateRoot, inputs.name)
    await Package.package(inputs.src, zipOutput, inputs.include, inputs.exclude)
    inputs.src = zipOutput

    const oldFuncObject = await cfc.getFunction(inputs.name)

    const outpout = {
      FunctionName: inputs.name,
      Runtime: inputs.runtime,
      Handler: inputs.handler,
      MemorySize: inputs.memorySize,
      Timeout: inputs.timeout,
      Region: inputs.region,
      Description: inputs.description,
    }

    console.log('deploy function...')
    const funcObject = await cfc.deploy(inputs, oldFuncObject)
    console.log('successfully deploy a function.')

    outpout.FunctionBrn = funcObject.body.FunctionBrn
    outpout.CodeSha256 = funcObject.body.CodeSha256
    outpout.SourceTag = funcObject.body.SourceTag

    // Update state
    this.state.name = inputs.name
    this.state.brn = outpout.FunctionBrn
    this.state.region = inputs.region

    await this.save()

    return {
      outpout
    }
  }

  /*
   * Remove (可选)
   * - 如果组件需要删除基础设施，推荐添加该方法
   * - 执行命令 `$ serverless remove` 会运行此函数
   */
  async remove(inputs = {}) {
    if (!this.state.name) {
      console.log(`No state found.  Function has been removed already.  Aborting.`)
      return
    }

    //console.log(inputs)
    this.credentials = {
      ak: process.env.BAIDU_ACCESS_KEY_ID,
      sk: process.env.BAIDU_SECRET_ACCESS_KEY
    }
    const { name, region } = this.state
    const cfcClient = new RemoveFunction(this.credentials.ak, this.credentials.sk, region)

    console.log(`Removing function ${name} from the ${region} region.`)
    await cfcClient.remove(name)
    console.log(`Successfully removed function ${name} from the ${region} region.`)

    this.state = {}
    await this.save()
    return {}
  }

}

module.exports = BaiduCLoudFunction
