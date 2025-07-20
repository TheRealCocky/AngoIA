const mongoose = require('mongoose');


const SessionScheduleSchema= new mongoose.Schema({
 userId:{type:mongoose.Schema.Types.ObjectId, ref :'User', required:true},
thema:{
     type: String,
    enum:['autoconhecimento', 'estudo', 'carreira', 'reflexão', 'livre'],
    default: 'livre'
},
    scheduledAt:{type:Date, required:true},
    status:{
     type: String,
        enum:['pending', 'done', 'skipped'],
        default: 'pending'
    },
    createdAt:{type:Date, default:Date.now}
});
module.exports=mongoose.model('SessionSchedule', SessionScheduleSchema);