// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const sesssion = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;


mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
.then (() =>{
  console.log('Connected to the dadatabase!')
})

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(sesssion({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
})
)
// app.use((req, res, next) => {
//     req.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// });
// set template engine
app.set('view engine', 'ejs');


// route prefix
app.use("", require("./routes/routes"))
app.use('/public', express.static('public'));

app.listen(PORT, () =>{
    console.log(`server started at http://localhost:${PORT}`);
})