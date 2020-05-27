const express = require('express');
const app = express();
const PORT = 3000;

const mongoose = require('mongoose');
const Ledger = require("../models");
const logger = require('morgan');
const compression = require('compression');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(logger('dev'));
app.use(compression());

mongoose.connect('mongodb://localhost/budget', {
    useNewUrlParser: true,
    useFindAndModify: false
});

// routes here

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});