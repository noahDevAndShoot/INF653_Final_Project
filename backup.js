/*
const readStatesFile = async () => {

    await fsPromises.readFile(path.join(__dirname, '..', 'states.json')) .then((data) => {
        console.log("Successfully read States.json file.");
        statesJson = data;
        statesJson = JSON.parse(statesJson);
        console.log(statesJson);
               
    });
    //console.log(statesJson);
    return statesJson; 
}

*/

/*
const fsPromises = require('fs').promises;


var statesJson;

async function readStates() {
    fsPromises.readFile('./states.json') .then((data) => {
    console.log("Successfully read States.json file.");
    statesJson = data;
    statesJson = JSON.parse(statesJson);
    //console.log(statesJson);
});
}
readStates();
*/

//var statesJson = getStatesData().then((data) => statesJson = data);