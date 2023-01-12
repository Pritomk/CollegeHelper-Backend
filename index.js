const express = require('express');
const connectToDatabase = require('./db');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
connectToDatabase();

const app = express();
const port = 5000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Successfully called college helper api')
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/class', require('./routes/class'))
app.use('/api/student', require('./routes/student'))
app.use('/api/attendance', require('./routes/attendance'))

app.listen(port, ()=>{
    console.log(`Backend server connected to http://localhost:${port}`)
})