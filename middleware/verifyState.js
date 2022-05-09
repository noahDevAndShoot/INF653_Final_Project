const express = require('express');
const statesData = require('../config/statesData');


const verifyState = async (req, res,  next) => {
    var data = statesData();
    var stateCodes = [];

    for (var i = 0; i < data.length; i++)
    {
        stateCodes.push(data[i].code);
    }
    if (stateCodes.indexOf(req.params.state.toUpperCase()) == -1)
    {
        res.status(404);
        res.json({"message": "Invalid state abbreviation parameter"});
    }
    else
    {
        next();
    }
}


//var stateCodes = data.map(state => state.code);
//console.log(stateCodes);

module.exports = {verifyState};