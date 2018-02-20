const rp = require('request-promise');
const xmlHandler = require('pixl-xml');

const auth = require('../helpers/auth');
const writeCSV = require('../helpers/writeCSV');
const Report = require('../helpers/mongo/reportSession');

module.exports = (app) => {
    app.post('/api/checkForBlockedEmails', (req, res) => {
        var request = req.body;
        
        // make sure all required data is present
        if(request.accountKey && request.token && request.subDomain && request.checkEmails) {
            // create object for authorization
            var authData = {
                ACCOUNT: request.accountKey[0],
                TOKEN: request.token[0],
                SUBD: request.subDomain[0]
            };
            
            var emailPattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
            var invalidAddresses = [];
            
            // process comma separated list of emails
            // and push invalid emails into array
            var emailsToCheck = request.checkEmails[0].split(',');
            emailsToCheck = emailsToCheck.map( (e) => {
                e = e.trim();
                if(!emailPattern.test(e)) {
                    invalidAddresses.push(e);
                }
                return e;
            });
            
            // create request options
            var blockedEmailEndPoint = '/Service.svc/v1/account/' + authData.ACCOUNT + '/blockedemails';
            
            var options = {
                uri: 'https://' + authData.SUBD + '.clickdimensions.com' + blockedEmailEndPoint,
                headers: {
                    'Authorization': auth(blockedEmailEndPoint, authData.TOKEN)
                }
            };
            
            rp(options)
                .then((results) => {
                    // parse to json
                    results = xmlHandler.parse(results);
                    
                    // process CreatedOn date to human readable format
                    var BlockedEmails = results.BlockedEmail.map((e) => {
                        var createdDateObject = new Date(e.CreatedOn.split('.')[0]);
                        e.CreatedOn = (createdDateObject.getMonth() + 1) + '-' + createdDateObject.getDate() + '-' + createdDateObject.getFullYear();
                        return e;
                    });
                    
                    // process and compare emails to check with blocked emails response
                    // then sort emails into blocked and not blocked arrays
                    var actuallyBlocked = [];
                    var loopLength = emailsToCheck.length;
                    
                    for(var i = 0; i < loopLength; i++) {
                        if(emailsToCheck.length === 0) {
                            return false;
                        }
                        for(var j = 0; j < BlockedEmails.length; j++) {
                            if(BlockedEmails[j].Email == emailsToCheck[i]) {
                                actuallyBlocked.push(BlockedEmails.splice(j, 1)[0]);
                                emailsToCheck.splice(i, 1);
                            }
                        }
                    }
                    
                    // get date-time of now to create unique file name
                    var date = new Date();
                    var sessionID = BlockedEmails[0].AccountKey + date.getDate() + date.getMonth() + date.getYear() + date.getHours() + date.getMinutes() + date.getMilliseconds();
                    var relDir = "/public/reports/" + sessionID;
                    
                    var blockedShare = writeCSV( __dirname, relDir, actuallyBlocked, "/Blocked.csv"),
                        notBlockedShare = writeCSV( __dirname, relDir, emailsToCheck, "/Not-Blocked.csv"),
                        invalidShare = writeCSV( __dirname, relDir, invalidAddresses, "/Invalid.csv");
                        
                    new Report({
                        sessionID: sessionID,
                        date: date,
                        account: authData.ACCOUNT,
                        invalidEmailsLink: invalidShare,
                        blockedEmailsLink: blockedShare,
                        notBlockedEmailsLink: notBlockedShare
                    }).save();
                    
                    // create response data object
                    var checkData = {
                        blocked: actuallyBlocked,
                        blockedURL: blockedShare,
                        notBlockedURL: notBlockedShare,
                        invalidURL: invalidShare
                    };
                    
                    res.status(200);
                    res.json(checkData);
                }).catch((err) => {
                    var message;
                    console.log(err);
                    if(err && err.name !== 'RequestError') {
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
                }).catch((err) => {
                    console.log(err);
                });
            
        } else {
            res.status(400).end('ERROR: Please provide an Account Key, Token, Sub-domain, and Emails to be Checked');
        }
        
    });
}