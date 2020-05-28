const CFC = require('@baiducloud/sdk').CfcClient;
const debug = require('debug')('cfc-component:CfcClient');

describe('CfcClient', function () {
    var client;
    var config = {
        'endpoint': 'http://cfc.bj.baidubce.com',
        'credentials': {
            'ak': 'your access key',
            'sk': 'your secret access key'
        }
    };
    client = new CFC(config);
    var body = {
        Code: {
            ZipFile: 'UEsDBBQACAAIAAAAAAAAAAAAAAAAAAAAAAAIAAAAaW5kZXguanNKrSjILyop1stIzEvJSS1SsFXQSC1LzSvRUUjO'
                     + 'zytJrQAxEnNykhKTszUVbO0UqrkUFBTgQhp5pTk5OgpgHdFKiUqxmtZctdaAAAAA//9QSwcI9fw51k4AAABUAAAA'
                     + 'UEsBAhQAFAAIAAgAAAAAAPX8OdZOAAAAVAAAAAgAAAAAAAAAAAAAAAAAAAAAAGluZGV4LmpzUEsFBgAAAAABAAEAN'
                     + 'gAAAIQAAAAAAA==',
            Publish: false,
            DryRun: true
        },
        Description: 'cfc_component_test_' + Date.now(),
        Region: 'bj',
        Timeout: 3,
        FunctionName: 'cfc_component_test_' + Date.now(),
        Handler: 'index.handler',
        Runtime: 'nodejs10',
        MemorySize: 128,
        Environment: {
            Variables: {
                a: 'b'
            }
        }
    };
    var brn;
    it('createFunction', function () {
        return client.createFunction(body)
            .then(function (response) {
                debug('createFunction response (%j)', response.body);
                brn = response.body.FunctionBrn;
                return client.getFunction(brn);
            }).then(function (response) {
                debug('getFunction response (%j)', response.body);
                body.Code.Publish = true;
                return client.updateFunctionCode(body.FunctionName, body.Code);
            }).then(function (response) {
                debug('updateFunctionCode response (%j)', response.body);
                body.Timeout = 10;
                return client.updateFunctionConfiguration(response.body.FunctionName, body);
            }).then(function (response) {
                debug('updateFunctionConfiguration response (%j)', response);
                return client.deleteFunction(body.FunctionName);
            }).catch(function (reason) {
                debug('error', reason);
            });
    });
});