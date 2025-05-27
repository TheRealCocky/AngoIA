const mongoose = require('mongoose')


const userSchema= new mongoose.Schema(
    {
        name: String,
        email:{type: String, unique: true, required: true},
        password: String,
        languagePreference: String,
        role: {type: String, default: 'user'}
    }, {timestamps: true}
);

module.exports= mongoose.model('User', userSchema);