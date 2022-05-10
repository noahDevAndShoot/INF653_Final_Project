const mongoose = require('mongoose');
const State = require('../models/States');
const statesData = require('../config/statesData');
const { json } = require('express/lib/response');
const res = require('express/lib/response');
const req = require('express/lib/request');
const statesJson = statesData();

/*
const getAllStates = async (req, res) => {
    const states = await State.find();
    if (!states)
    {
        res.status(404);
        res.json({"response": "404"});
    }
    res.json(states);

};
*/

const mergeFileAndDB = (funfacts, states) => {
    for (var i = 0; i < funfacts.length; i++)
    {
        var matchingObject = states.find(state => state.code == funfacts[i].stateCode);
        if (!matchingObject)
        {
            continue;
        }
        //console.log(matchingObject);
        matchingObject.funfacts = funfacts[i].funfacts;
    }
    return states;
}

const getAllStates = async (req, res) => {
    res.status(200);
    var statesClone;
    var output;

    if (req.query.contig == "true")
    {
        statesClone = statesJson.filter(state => (state.code != "AK" && state.code != "HI"));
    }
    else if (req.query.contig == "false")
    {
        statesClone = statesJson.filter(state => state.code == "AK" || state.code == "HI");
    }
    else
    {
        statesClone = [...statesJson];
    }
    var funfacts = await State.find();    
    if (!funfacts)
    {
        console.log("No fun facts found");
    }
    else
    {
        mergeFileAndDB(funfacts, statesClone);   
    }
    res.json(statesClone);
}


const getState = async (stateParam) => {
    var statesClone = [...statesJson];
    var state = await statesClone.find((state) => 
    state.code == stateParam.toUpperCase());

    var stateFunFacts = await State.findOne({stateCode: stateParam.toUpperCase()});
    if (!stateFunFacts)
    {
        console.log("No Fun Facts found for " + state.state);
    }
    else
    {
        state.funfacts = stateFunFacts.funfacts;
    }
    return state;
};

const getStateByState = async (req, res) => {
    var state = await getState(req.params.state.toUpperCase());
    res.json(state);
}

const getStateNickname = async (req, res) => {
    var state = await getState(req.params.state.toUpperCase());
    res.json({"state": state.state, "nickname": state.nickname})
}

const getStateCapital = async (req, res) => {
    var state = await getState(req.params.state.toUpperCase());
    res.json({"state": state.state, "capital": state.capital_city})
}

const getStatePopulation = async (req, res) => {
    var state = await getState(req.params.state.toUpperCase());
    res.json({"state": state.state, "population": state.population})
}

const getStateAdmission = async (req, res) => {
    var state = await getState(req.params.state.toUpperCase());
    res.json({"state": state.state, "admitted": state.admission_date})
}

const getStateFunfact = async (req, res) => {
    var state = await getState(req.params.state.toUpperCase());
    if (!state.funfacts)
    {
        res.json({"message": "No Fun Facts found for " + state.state});
    }
    else
    {
        if (state.funfacts.length == 0)
        {
            res.json({"message": "funfacts is empty"});
        }
        res.json({"funfact": state.funfacts[Math.floor(Math.random()*state.funfacts.length)]});
    }    
}

const createNewFunfact = async (req, res) =>
{
    if (!req?.body?.funfacts)
    {
        res.status(400).json({"message": "State fun facts value required"});
    }
    else if (!Array.isArray(req.body.funfacts))
    {
        res.status(400).json({"message": "State fun facts value must be an array"})
    }
    else
    {
        var stateFunFacts = await State.findOne({stateCode: req.params.state.toUpperCase()});
        if (!stateFunFacts)
        {
            console.log("No fun facts found for state " + req.params.state.toUpperCase());
            const reply = await State.create({
                "stateCode": req.params.state.toUpperCase(),
                "funfacts": req.body.funfacts 
            });
            res.json(reply);
        }
        else
        {
            stateFunFacts.funfacts = stateFunFacts.funfacts.concat(req.body.funfacts);
            const reply = await stateFunFacts.save();
            res.json(reply);
        }
    }   
}

const updateFunfact = async (req, res) => {
    if (!req?.body?.index)
    {
        res.status(400);
        res.json({'message': 'State fun fact index value required'});
    }
    else if (!req?.body?.funfact)
    {
        res.status(400);
        res.json({'message': 'State fun fact value required'});
    }
    else
    {
        var state = statesJson.find((state) => state.code == req.params.state.toUpperCase());
        var stateFunFacts = await State.findOne({stateCode: req.params.state.toUpperCase()});
        if (!stateFunFacts)
        {
            res.status(404);
            res.json({'message': 'No Fun Facts found for ' + state.state});
        }
        else
        {
            let index = parseInt(req.body.index);
            if (index < 1 || index > stateFunFacts.funfacts.length)
            {
                res.status(400);
                res.json({'message': 'No Fun Fact found at that index for ' + state.state});
            }
            else
            {
                stateFunFacts.funfacts[parseInt(req.body.index) - 1] = req.body.funfact;
                const reply = await stateFunFacts.save();
                res.json(reply);
            }
        }
    }

}

const deleteFunfact = async (req, res) => {
    if (!req?.body?.index)
    {
        res.status(400).json({"message": 'State fun fact index value required'});
    }
    else
    {
        var state = statesJson.find((state) => state.code == req.params.state.toUpperCase());
        var stateFunFacts = await State.findOne({stateCode: req.params.state.toUpperCase()});
        if (!stateFunFacts)
        {
            res.status(404).json({"message": "No Fun Facts found for " + state.state})
        }
        else
        {
            let index = parseInt(req.body.index);
            if (index < 1 || index > stateFunFacts.funfacts.length)
            {
                res.status(400).json({"message": "Invalid index"});
            }
            else
            {
                stateFunFacts.funfacts = stateFunFacts.funfacts.filter((value, i) => {return i != (index - 1)})
                const reply = await stateFunFacts.save();
                res.json(reply);
            }
        }
    }
}


module.exports = {
    getAllStates, 
    getStateByState, 
    getStateNickname,
    getStateCapital,
    getStatePopulation,
    getStateAdmission,
    getStateFunfact,
    createNewFunfact,
    updateFunfact,
    deleteFunfact
};