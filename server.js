require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
var getStatesData = require('./config/statesData');
var statesJson = getStatesData();
const verify = require('./middleware/verifyState');
const statesController = require('./controllers/statesController');
const cors = require('cors');


connectDB();

app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/states/:state', verify.verifyState);


app.get('/states', statesController.getAllStates);

app.get('/states/:state', statesController.getStateByState);

app.get('/states/:state/nickname', statesController.getStateNickname);

app.get('/states/:state/capital', statesController.getStateCapital);

app.get('/states/:state/population', statesController.getStatePopulation);

app.get('/states/:state/admission', statesController.getStateAdmission);

app.get('/states/:state/funfact', statesController.getStateFunfact);

app.post('/states/:state/funfact', statesController.createNewFunfact);

app.patch('/states/:state/funfact', statesController.updateFunfact);

app.delete('/states/:state/funfact', statesController.deleteFunfact);

app.all('*', (req, res) => {
    res.status(404);
    res.json({"response": "404"});
});


mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log("Server listening on Port " + PORT));
});

