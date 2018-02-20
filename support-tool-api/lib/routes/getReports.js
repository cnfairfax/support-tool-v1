const Report = require('../helpers/mongo/reportSession');

module.exports = (app) => {
    
    app.post('/api/getReports', (req, res) => {
        var request = req.body;
        
        Report.find({ account: request.accountKey[0] }, (err, reports) => {
            if(err) {
                res.status(500);
                res.send('There was an Error: ' + err);
            } else {
                console.log(JSON.stringify(reports));
                res.status(200);
                res.json(reports);
            }
        });
        
        
    });
    
}