const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Note = new mongoose.model('note', NotesSchema);