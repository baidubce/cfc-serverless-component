const Abstract = require('./abstract')

class RemoveFunction extends Abstract {
    async remove (funcName) {
        try {
            return await this.cfcClient.deleteFunction(funcName)
        } catch(e) {
            console.log('err: ' + e)
            console.log('ErrorCode: ' + e.message.Code + 'cause: ' + e.message.Cause)
            throw e
        }
    }
}

module.exports = RemoveFunction