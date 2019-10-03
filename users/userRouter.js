const express = require('express');

const Users = require('./userDb')
const router = express.Router();

router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {
    Users.get()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: 'error getting users'})
    })
});

router.get('/:id', validateUserId,  (req, res) => {
    console.log('received user')
res.status(200).json(req.user)
});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    const {name} = req.body

    Users.update(id, {name})
    .then(updated => {
        if (updated) {
            Users.getById(id)
            .then(user => res.status(200).json(user))
            .catch(err => {
                console.log(err)
                res.status(500).json({error: 'error getting user'})
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: 'error updating user'})
    })
});

//custom middleware

function validateUserId(req, res, next) {
    const {id} = req.params

   Users.getById(id)
   .then(user => {
       if (user) {
           req.user = user
           next()
       } else {
           res.status(404).json({error: 'user with id doesnt exist'})
       }
   })
}

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
