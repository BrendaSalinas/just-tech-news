const router = require('express').Router();
const { User } = require('../../models');

//GET /api/users - this is to get all users 
router.get('/', (req, res) => {
    //Access our User model and run .findAll() method) equivalent to SELECT * FROM users;
    User.findAll({
        //This will hide the password
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/users/1
router.get('/:id', (req, res) => {

    // findOne we're using the where option to indicate we want to find a user where its id value equals whatever req.params.id. equivalent to: SELECT * FROM users WHERE id = 1
    User.findOne({
        //This will hide the password
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST /api/users 
router.post('/', (req, res) => {
    //expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}. equivalent to: 
    // INSERT INTO users
    // (username, email, password)
    // VALUES
    // ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//this is a login route, it will allow the user to login 
router.post('/login', (req, res) => {
    //Query operation expects {email: 'lerantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user with that e-mail address found!'});
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!' });
            return;
        }

        res.json({ user: dbUserData, message: "You're now Logged In! "})
         //res.json({ user: dbUserData});
    });
});
//PUT /api/users/1
router.put('/:id', (req, res) => {
 // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    //UPDATE users
    //SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
    //WHERE id = 1;
  User.update(req.body, {
      individualHooks: true,
      where: {
          id: req.params.id
      }
  })
  .then(dbUserData => {
      if (!dbUserData[0]) {
          res.status(404).json ({ message: "No user found with this id"})
          return;
      }
      res.json(dbUserData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
    
});



//DELETE /api/users/1
router.delete('/:id', (req, res) => {
    //To delete users from the database.
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id '});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;