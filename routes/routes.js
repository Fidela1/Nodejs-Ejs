const express = require('express');
const router = express.Router();
const User = require('../models/users')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

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
    User.find()
    .then(users => {
        res.render('index', {
            title: 'Home Page',
            users: users,
        });
    })
    .catch(err => {
        res.json({ message: err.message });
    });
})
router.get("/add", (req, res) =>{
    res.render('add_users', { title: "Add Users" })
})

// Edit user
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
  .then(user => {
    if (user === null) {
      res.redirect('/');
    } else {
      res.render('edit_users', {
        title: "Edit user",
        user: user,
      });
    }
  })
  .catch(err => {
    res.redirect('/');
  });
})
router.post("/update/:id", upload, async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
        // Check if the old image file exists before attempting to delete it
        if (fs.existsSync("./uploads/" + req.body.old_image)) {
          fs.unlinkSync("./uploads/" + req.body.old_image);
        } else {
          console.log("Old image file not found, no need to delete.");
        }
      } catch (err) {
        console.error(err);
      }
  } else {
    new_image = req.body.old_image;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    if (!updatedUser) {
      res.json({ message: "User not found", type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "User updated successfully",
      };
      res.redirect("/");
    }
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Delete user
router.get('/delete/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await User.findByIdAndRemove(id);

    if (result.image != '') {
      try {
        fs.unlinkSync('./uploads/' + result.image);
      } catch (err) {
        console.log(err);
      }
    }

    req.session.message = {
      type: 'info',
      message: 'User deleted successfully!'
    };

    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message });
  }

});
module.exports = router;