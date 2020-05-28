const CFC = require('@baiducloud/sdk').CfcClient

global.endpointMap = new Map([['bj','https://cfc.bj.baidubce.com'],['gz','https://cfc.gz.baidubce.com'],['su','https://cfc.su.baidubce.com']])

class AbstractHandler {
    constructor(secret_id, secret_key, region) {
        this._cfcClient = AbstractHandler.createCfcClient(secret_id, secret_key, region)
    }

    static createCfcClient(secret_id, secret_key, region) {
        var credentials = {
            'ak': secret_id,
            'sk': secret_key
        }
        var config = {
            'endpoint': global.endpointMap.get(region),
            'credentials': credentials
        }
        const cfcClient = new CFC(config)
        return cfcClient
    }

    get cfcClient() {
        return this._cfcClient
    }
}

module.exports = AbstractHandler