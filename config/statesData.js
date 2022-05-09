const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');


const readStatesFileSync = () => {
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'states.json')));
    //console.log(data);
    return data;
}


module.exports = readStatesFileSync;

