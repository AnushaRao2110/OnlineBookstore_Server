const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://anusharao:mongodb123@onlinebookstore-rxwzz.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false},(err)=>{
    if(!err)
        console.log("MongoDb Connection successfull at port 27017");
    else
        console.log("Error"+JSON.stringify(err,undefined,2));
});

module.exports = mongoose;



