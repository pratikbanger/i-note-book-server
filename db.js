const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const mongoURI = "mongodb+srv://proplayer:GodofHacker@cluster0.tgawyy6.mongodb.net/iNoteBook?retryWrites=true&w=majority"
// const mongoURI = "mongodb://localhost:27017"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;