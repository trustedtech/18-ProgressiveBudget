const express = require('express');
const app = express();
const PORT = 3000;

const mongoose = require('mongoose');
const Entry = require('./models');
const logger = require('morgan');
const compression = require('compression');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(logger('dev'));
app.use(compression());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/budget', {
    useNewUrlParser: true,
    useFindAndModify: false
});

app.get('/api/entry', (req, res) => {
    Entry.find({})
        .sort( { date: -1 })
        .then( data => res.json(data) )
        .catch( err => res.json(err) )
    ;
});

app.post('/api/entry', ( {body}, res) => {
    Entry.create(body)
        .then( data => res.json(data) )
        .catch( err => res.json(err) )
    ;
});

app.post('/api/entry/bulk', ( {body}, res) => {
    Entry.insertMany(body)
        .then( data => res.json(data) )
        .catch( err => res.json(err) )
    ;
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});