const Abstract = require('./abstract')
const { readFile } = require('fs-extra')

const { getEnvironment, getVPCConfig } = require('./utils')

class DeployFunction extends Abstract {
    async deploy(newFunc, oldFuncObject) {
        if(!oldFuncObject) {
            return await this.createFunction(newFunc)
        } else {
            console.log('oldFunc', oldFuncObject.body)
            if (newFunc.runtime != oldFuncObject.body.Configuration.Runtime) {
                throw `Runtime error: Release runtime(${oldFuncObject.body.Runtime}) is different from local runtime(${newFunc.runtime})`
            }
            console.log('Updating code...')
            await this.updateFunctionCode(newFunc)
            console.log('Successfully update function code!')

            console.log('Updating configuration...')
            return await this.updateFunctionConfig(newFunc)
        }
    }

    /**
     * create function
     * @param {*} newFunc 
     */
    async createFunction(newFunc) {
        var createFunctionRequest = {
            'FunctionName': newFunc.name,
            'Handler': newFunc.handler,
            'MemorySize': newFunc.memorySize,
            'Runtime': newFunc.runtime,
            'Timeout': newFunc.timeout,
            'Description': newFunc.description,
            'LogType': newFunc.logType,
            'LogBosDir': newFunc.logBosDir,
            'SourceTag': newFunc.sourceTag,
            'DeadLetterTopic': newFunc.deadLetterTopic,
        }

        var zipFile = await readFile(newFunc.src, {encoding: 'base64'})
        createFunctionRequest.Code = {
            'ZipFile':  zipFile,
            'Publish': newFunc.publish,
            'BosBucket': newFunc.bosBucket,
            'BosObject': newFunc.bosObject
        }
        createFunctionRequest.Environment = getEnvironment(newFunc)
        createFunctionRequest.VpcConfig = getVPCConfig(newFunc)

        try {
            return await this.cfcClient.createFunction(createFunctionRequest)
        } catch(e) {
            console.log('err: ' + e)
            console.log('ErrorCode: ' + e.message.Code + 'cause: ' + e.message.Cause)
            throw e
        }
    }

    /**
     * get function
     * @param {*} funcName 
     */
    async getFunction(funcName) {
        try {
            return await this.cfcClient.getFunction(funcName)
        } catch (e) {
            if (e.message.Code === 'ResourceNotFoundException') {
                return null
            }
            console.log('err: ' + e)
            console.log('ErrorCode: ' + e.message.Code + 'cause: ' + e.message.Cause)
            throw e
        }
    }

    /**
     * update function code
     * @param {*} newFunc 
     */
    async updateFunctionCode(newFunc) {
        var zipFile = await readFile(newFunc.src, {encoding: 'base64'})

        var code = {
            'ZipFile': zipFile,
            'Publish': newFunc.publish
        }
        try {
            return await this.cfcClient.updateFunctionCode(newFunc.name, code)
        } catch (e) {
            console.log('err: ' + e)
            console.log('ErrorCode: ' + e.message.Code + 'cause: ' + e.message.Cause)
            throw e
        }
    }

    /**
     * update function configuration
     * @param {*} newFunc 
     */
    async updateFunctionConfig(newFunc) {
        const configRequest = {
            'Timeout': newFunc.timeout,
            'Description': newFunc.description,
            'Handler': newFunc.handler,
            'Runtime': newFunc.runtime,
            'LogType': newFunc.logType,
            'LogBosDir': newFunc.logBosDir,
            'SourceTag': newFunc.sourceTag,
            'DeadLetterTopic': newFunc.deadLetterTopic,
        }
        configRequest.Environment = getEnvironment(newFunc)
        newFunc.VpcConfig = getVPCConfig(newFunc)
        try {
            return await this.cfcClient.updateFunctionConfiguration(newFunc.name, configRequest)
        } catch (e) {
            console.log('err: ' + e)
            console.log('ErrorCode: ' + e.message.Code + 'cause: ' + e.message.Cause)
            throw e
        }
    }

}

module.exports = DeployFunction