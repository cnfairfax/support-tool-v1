const fs = require('fs');
const csvHandler = require('fast-csv');

module.exports = (dirName, relDir, emails, fileName) => {
    var directory = dirName + relDir;
                        
    if (!fs.existsSync(directory)) {
        try {
            fs.mkdir(directory)
        } catch(err) {
            throw new Error(err);
        }
    }
    
    
    var csvStream = csvHandler.createWriteStream({headers: true}),
        path = directory + fileName,
        shareURL = relDir + fileName,
        writableStream = fs.createWriteStream( path );
    
    // write not blocked emails csv
    csvStream.pipe(writableStream);
    emails.forEach((row) => {
        // force array in .write() argument to keep string
        // from being processed as array
        if(typeof row === "string") {
            csvStream.write([row]);   
        } else {
            csvStream.write(row);
        }
    });
    csvStream.end();
    
    return shareURL;
}