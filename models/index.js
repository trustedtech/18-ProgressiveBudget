const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ledgerSchema = new Schema({

    
});    

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;