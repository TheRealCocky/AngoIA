// models/ChatMessage.js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            enum: ['user', 'bot'],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: function () {
                return this.sender === 'user';
            }
        },
        text: {
            type: String,
            required: true
        },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChatMessage',
            default: null
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        dislikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    { timestamps: true }
);

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
module.exports = { ChatMessage };




