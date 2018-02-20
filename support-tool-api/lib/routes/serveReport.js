module.exports = (app) => {

    app.get('/public/reports/*', (req, res) => {
        var name;
        if(req.url.toLowerCase().indexOf('not-blocked') != -1) {
            name = 'not-blocked-report.csv';
        } else if(req.url.toLowerCase().indexOf('invalid') != -1) {
            name = 'invalid-email-report.csv';
        } else {
            name = 'blocked-report.csv'
        }
        
        res.download( __dirname + req.url, name);
    });

}