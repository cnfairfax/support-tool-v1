'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const rp = require('request-promise');
const xmlHandler = require('pixl-xml');
const csvHandler = require('fast-csv');

const auth = require('./helpers/auth');

// Open up CORS
// app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set up request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/public/reports*', (req, res) => {
    res.attachment('report.csv');
    res.sendFile(__dirname + req.url);
    res.end();
});

app.post('/api/blockedEmails', (req, res) => {
    var request = req.body;
    if (request.accountKey && request.token && request.subDomain) {
        var authData = {
            ACCOUNT: request.accountKey[0],
            TOKEN: request.token[0],
            SUBD: request.subDomain[0]
        };

        var stream = fs.createWriteStream(__dirname + "/insteadDB/authData.txt");

        stream.once('open', function (fd) {
            stream.write(JSON.stringify(authData));
            stream.end();
        });

        var blockedEmailEndPoint = '/Service.svc/v1/account/' + authData.ACCOUNT + '/blockedemails';

        var options = {
            uri: 'https://' + authData.SUBD + '.clickdimensions.com' + blockedEmailEndPoint,
            headers: {
                'Authorization': auth(blockedEmailEndPoint, authData.TOKEN)
            }
        };

        rp(options).then(results => {
            results = xmlHandler.parse(results);
            res.statusCode = 200;
            res.json(results.BlockedEmail);
        }).catch(err => {
            var message;
            if (err.name !== 'RequestError') {
                message = xmlHandler.parse(err.error);
                if (message.Message == 'Request string does not match Authorization header') {
                    message.Message = 'Invalid token';
                }
            } else {
                message = err;
                message['Message'] = 'Invalid Subdomain';
            }
            res.statusCode = err.statusCode ? err.statusCode : 404;
            //console.log(err);
            res.end('ERROR: ' + message.Message);
        });
    } else {
        res.status(400).end('ERROR: Please provide an Account Key, Token, and Sub-domain');
    }
});

app.post('/api/unblockEmail', (req, res) => {
    var accountData = fs.readFileSync(__dirname + '/insteadDB/authData.txt').toString();
    accountData = JSON.parse(accountData);

    var unblockEmailEndPoint = '/Service.svc/v1/account/' + accountData.ACCOUNT + '/blockedemail/' + req.body.Email;

    var options = {
        uri: 'https://' + accountData.SUBD + '.clickdimensions.com' + unblockEmailEndPoint,
        method: 'DELETE',
        headers: {
            'Authorization': auth(unblockEmailEndPoint, accountData.TOKEN)
        }
    };

    rp(options).then(results => {
        res.status(200);
        res.end('Success');
    }).catch(err => {
        console.log(err);
        res.end('THERE WAS AN ERROR: ' + err);
    });
});

app.post('/api/checkForBlockedEmails', (req, res) => {
    var request = req.body;
    if (request.accountKey && request.token && request.subDomain && request.checkEmails) {
        var authData = {
            ACCOUNT: request.accountKey[0],
            TOKEN: request.token[0],
            SUBD: request.subDomain[0]
        };

        var emailsToCheck = request.checkEmails[0].split(',');

        emailsToCheck = emailsToCheck.map(e => e.trim());

        var stream = fs.createWriteStream(__dirname + "/insteadDB/authData.txt");

        stream.once('open', function (fd) {
            stream.write(JSON.stringify(authData));
            stream.end();
        });

        var blockedEmailEndPoint = '/Service.svc/v1/account/' + authData.ACCOUNT + '/blockedemails';

        var options = {
            uri: 'https://' + authData.SUBD + '.clickdimensions.com' + blockedEmailEndPoint,
            headers: {
                'Authorization': auth(blockedEmailEndPoint, authData.TOKEN)
            }
        };

        rp(options).then(results => {
            var date = new Date();

            results = xmlHandler.parse(results);

            var BlockedEmails = results.BlockedEmail.map(e => {
                var createdDateObject = new Date(e.CreatedOn.split('.')[0]);
                e.CreatedOn = createdDateObject.getMonth() + 1 + '-' + createdDateObject.getDate() + '-' + createdDateObject.getFullYear();
                return e;
            });

            var csvStreamBlocked = csvHandler.createWriteStream({ headers: true }),
                blockedPath = "/public/reports/" + BlockedEmails[0].AccountKey + date.getDate() + date.getMonth() + date.getYear() + date.getHours() + date.getMinutes() + date.getMilliseconds() + "-Blocked.csv",
                writableStreamBlocked = fs.createWriteStream(__dirname + blockedPath);

            var csvStreamNotBlocked = csvHandler.createWriteStream({ headers: true }),
                notBlockedPath = "/public/reports/" + BlockedEmails[0].AccountKey + date.getDate() + date.getMonth() + date.getYear() + date.getHours() + date.getMinutes() + date.getMilliseconds() + "-Not-Blocked.csv",
                writableStreamNotBlocked = fs.createWriteStream(__dirname + notBlockedPath);

            var actuallyBlocked = [];
            var loopLength = emailsToCheck.length;

            for (var i = 0; i < loopLength; i++) {
                if (emailsToCheck.length === 0) {
                    console.log('empty');
                    return false;
                }
                for (var j = 0; j < BlockedEmails.length; j++) {
                    if (BlockedEmails[j].Email == emailsToCheck[i]) {
                        actuallyBlocked.push(BlockedEmails.splice(j, 1)[0]);
                        emailsToCheck.splice(i, 1);
                    }
                }
            }

            csvStreamBlocked.pipe(writableStreamBlocked);
            actuallyBlocked.forEach(obj => {
                csvStreamBlocked.write(obj);
            });
            csvStreamBlocked.end();

            csvStreamNotBlocked.pipe(writableStreamNotBlocked);
            csvStreamNotBlocked.write(['Email Address']);
            emailsToCheck.forEach(str => {
                csvStreamNotBlocked.write([str]);
            });
            csvStreamNotBlocked.end();

            var checkData = {
                blocked: actuallyBlocked,
                blockedURL: blockedPath,
                notBlockedURL: notBlockedPath
            };

            res.status(200);
            res.json(checkData);
        }).catch(err => {
            var message;
            console.log(err);
            if (err && err.name !== 'RequestError') {
                message = xmlHandler.parse(err.error);
                if (message.Message == 'Request string does not match Authorization header') {
                    message.Message = 'Invalid token';
                }
            } else {
                message = err;
                message['Message'] = 'Invalid Subdomain';
            }
            res.statusCode = err.statusCode ? err.statusCode : 404;
            //console.log(err);
            res.end('ERROR: ' + message.Message);
        }).catch(err => {
            console.log(err);
        });
    } else {
        res.status(400).end('ERROR: Please provide an Account Key, Token, Sub-domain, and Emails to be Checked');
    }
});

app.listen(8082, console.log('listening on port 8082'));