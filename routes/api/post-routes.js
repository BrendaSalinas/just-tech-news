const router = require('express').Router();
const { get } = require('.');
const { Post, User } = require('../../models');

//get all users 

router.get('/', (req, res) => {
    console.log('=====================');
    Post.findAll({
        //Query configuration
        attributes: ['id', 'post_url', 'title', 'created_at'],
        //this will ensure that the latest posted articles appear first on the website 
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User, 
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            //404 status code identifies a user error and will need a different request for a successful response.
            res.status(404).json({ message: 'No post found with this id'} );
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    //expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}. equivalent to: 
    // INSERT INTO users
    // (username, email, password)
    // VALUES
    // ("Lernantino", "lernantino@gmail.com", "password1234");
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
   
     // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
       //UPDATE users
       //SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
       //WHERE id = 1;
     Post.update(
         {
            title: req.body.title
         },
         {
            where: {
                id: req.params.id
            }
        }
     )
     .then(dbPostData => {
         if (!dbPostData) {
             res.status(404).json ({ message: "No post found with this id"})
             return;
         }
         res.json(dbPostData);
     })
     .catch(err => {
         console.log(err);
         res.status(500).json(err);
    });
       
});

router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;

