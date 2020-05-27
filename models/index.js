const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({

    date: {
        type: Date,
        default: Date.now
    },
    desc: {
        type: String,
        trim: true,
        required: "Description is required"
    },
    amount: {
        type: Number,
        required: "Amount is required"
    }  
         
});    

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;