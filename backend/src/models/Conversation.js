const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);

