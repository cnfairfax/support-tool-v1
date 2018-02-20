var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var ReportSessionSchema = new Schema({
    sessionID: String,
    date: {type: Date, default: Date.now},
    account: String,
    invalidEmailsLink: String,
    blockedEmailsLink: String,
    notBlockedEmailsLink: String
});

module.exports = mongoose.model('ReportSession', ReportSessionSchema);