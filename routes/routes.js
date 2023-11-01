const express = require('express');
const router = express.Router();
const User = require('../models/users')
const multer = require('multer');
const path = require('path');

// image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname +"_"+ Date.now() +"_"+ file.originalname)
    }
})
var upload = multer({
    storage: storage,
}).single('image');

// Insert an user into database route
router.post('/add', upload, (req, res) =>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone:req.body.phone,
        image: req.file.filename,
    });
    user.save()
    .then(savedUser => {
        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect('/');
    })
    .catch(err => {
        res.json({ message: err.message, type: 'danger' });
    });
})
// Get all users route

router.get("/", (req, res) =>{
    User.find().exec((err, users) => {
        if(err){
            res.json({message: err.message })
        } else {
            res.render('index', {
                title: 'Home Page',
                users: users,
            })
        }
    })
})
router.get("/add", (req, res) =>{
    res.render('add_users', { title: "Add Users" })
})
module.exports = router;