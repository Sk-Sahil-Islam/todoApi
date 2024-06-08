const express = require('express');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./db.js');


const app = express();

app.use(morgan('dev'));
app.use(express.json());

dotenv.config({
    path: './config/config.env'
});
connectDB();

app.use('/api/todo/auth', require('./routes/user.js'));
app.use('/api/todo', require('./routes/todo.js'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running in port: ${PORT}`.red.underline.bold));