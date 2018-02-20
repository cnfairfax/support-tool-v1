const rp = require('request-promise');
const xmlHandler = require('pixl-xml');

const auth = require('../helpers/auth');

module.exports = (app) => {

    app.post('/api/blockedEmails', (req, res) => {
        var request = req.body;
        if(request.accountKey && request.token && request.subDomain) {
            var authData = {
                ACCOUNT: request.accountKey[0],
                TOKEN: request.token[0],
                SUBD: request.subDomain[0]
            }
            
            var blockedEmailEndPoint = '/Service.svc/v1/account/' + authData.ACCOUNT + '/blockedemails';
            
            var options = {
                uri: 'https://' + authData.SUBD + '.clickdimensions.com' + blockedEmailEndPoint,
                headers: {
                    'Authorization': auth(blockedEmailEndPoint, authData.TOKEN)
                }
            }
            
            rp(options)
                .then((results) => {
                    results = xmlHandler.parse(results);
                    res.statusCode = 200;
                    res.json(results.BlockedEmail);
                }).catch((err) => {
                    var message;
                    if(err.name !== 'RequestError') {
                        message = xmlHandler.parse(err.error);
                        if(message.Message == 'Request string does not match Authorization header') {
                            message.Message = 'Invalid token';
                        }
                    } else {
                        message = err;
                        message['Message'] = 'Invalid Subdomain';
                    }
                    var statusCode = err.statusCode ? err.statusCode : 404;
    
                    res.status(statusCode).end('ERROR: ' + message.Message);
                });
            
        } else {
            res.status(400).end('ERROR: Please provide an Account Key, Token, and Sub-domain');
        }    
    });
    
}