const rp = require('request-promise');

const auth = require('../helpers/auth');

module.exports = (app) => {
    app.post('/api/unblockEmail', (req, res) => {

        var accountData = {
            ACCOUNT: req.body.accountKey[0],
            TOKEN: req.body.token[0],
            SUBD: req.body.subd[0]
        };
        
        var unblockEmailEndPoint = '/Service.svc/v1/account/' + accountData.ACCOUNT + '/blockedemail/' + req.body.Email;
        
        var options = {
            uri: 'https://' + accountData.SUBD + '.clickdimensions.com' + unblockEmailEndPoint,
            method: 'DELETE',
            headers: {
                'Authorization': auth(unblockEmailEndPoint, accountData.TOKEN)
            }
        };
        
        rp(options)
            .then((results) => {
                res.status(200);
                res.end('Success');
            })
            .catch((err) => {
                res.status(err.statusCode);
                res.end('THERE WAS AN ERROR: ' + err);
            });
    });
}