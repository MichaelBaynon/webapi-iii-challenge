const express = require("express");

const Users = require("./userDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const { name } = req.body;
  Users.insert({ name })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error inserting user" });
    });
});

router.post("/:id/posts", validateUser, validatePost, (req, res) => {});

router.get("/", (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error getting users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  console.log("received user");
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId,  (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error getting user posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.user;
  Users.remove(id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error deleting user" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  Users.update(id, { name })
    .then(updated => {
      if (updated) {
        Users.getById(id)
          .then(user => res.status(200).json(user))
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "error getting user" });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error updating user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  Users.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ error: "user with id doesnt exist" });
    }
  });
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name required" });
  }
  if (typeof name !== "string") {
    return res.status(400).json({ error: "name must be a string" });
  }

  next();
}

function validatePost(req, res, next) {
  const id = req.params.id;
  const body = req.body;
  const text = body.text;

  if (!id) {
    return res.status(400).json({ error: "post with this id doenst exist" });
  } else {
    if (!body) {
      return res.status(400).json({ error: "missing post data" });
    }
    if (!text) {
        return res.status(400).json({error: 'missing required text field'})
    }
  } 


  next();
}

module.exports = router;
