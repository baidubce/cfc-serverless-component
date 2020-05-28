const CFC = require('@baiducloud/sdk').CfcClient

global.endpointMap = new Map([['bj','https://cfc.bj.baidubce.com'],['gz','https://cfc.gz.baidubce.com'],['su','https://cfc.su.baidubce.com']])


const randomId = Math.random()
   .toString(36)
   .substring(6)

/**
 * Get CFC client
 * @param {*} credentials 
 * @param {*} region 
 */
const getCfcClient = (credentials, region) => {
    var config = {
        'endpoint': global.endpointMap.get(region),
        'credentials': credentials
    }
    const cfcClient = new CFC(config)
    return cfcClient
}

/**
 * Prepare inputs
 * @param {*} inputs 
 * @param {*} instance 
 */
const prepareInputs = (inputs, instance) => {
    return {
        name:
          inputs.name || instance.state.name || `baidu-cfc-component-${instance.stage}-${randomId}`,
        src: inputs.src || null,
        handler: inputs.handler || 'index.handler',
        runtime: inputs.runtime || 'nodejs10',
        region: inputs.region || 'bj',
        description: inputs.description || 'My Serverless Function',
        memorySize: inputs.memorySize || 128,
        timeout: inputs.timeout || 3,
        logType: inputs.logType || '',
        logBosDir: inputs.logBosDir || '',
        environment: inputs.environment || null,
        publish: inputs.publish || false,
        bosBucket: inputs.bosBucket || '',
        bosObject: inputs.bosObject || '',
        sourceTag: inputs.sourceTag || '',
        vpcConfig: inputs.vpcConfig || null,
        deadLetterTopic: inputs.deadLetterTopic || ''

    }
}

/**
 * get environment
 * @param {*} inputs 
 */
const getEnvironment = (inputs) => {
    if (inputs && inputs.environment) {
        return {Variables : inputs.environment.variables}
    }
    return {Variables:{}}
}

const getVPCConfig = (inputs) => {
    const vpcConfig = inputs.vpcConfig
    const vpcId = vpcConfig && vpcConfig.vpcId ? vpcConfig.vpcId : ''
    const subnetIds = vpcConfig && vpcConfig.subnetIds ? vpcConfig.subnetIds: []
    const securityGroupIds = vpcConfig && vpcConfig.securityGroupIds ? vpcConfig.securityGroupIds : []
    if (vpcId && subnetIds && securityGroupIds) {
        return {VpcId: vpcId, SubnetIds: subnetIds, SecurityGroupIds: securityGroupIds}
    }
    return null
}

module.exports = {
    prepareInputs,
    getCfcClient,
    getEnvironment,
    getVPCConfig
}
