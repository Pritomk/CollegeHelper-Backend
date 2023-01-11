const mongoose = require('mongoose');
const { mongoURI } = require('./config/keys');

const connectToDatabase = () => {
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to database successfully");
    })
}

module.exports = connectToDatabase;