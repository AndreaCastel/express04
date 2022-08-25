const database = require("./database");

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
        res.status(200).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error from User DB")
    })
  };

const usersId = (req, res) => {
    const id = parseInt(req.params.id);
    
    database
        .query("select * from users where id = ?", [id])
        .then(([users]) => {
            if(users[0] != null) {
                res.json(users[0]);
            } else {
                res.status(404).send("user not found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("user DB failed");
        })
};

const postUsers = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
  
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language]
      )
      .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving user");
      });
  };

const putUsers = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("bad user");
      } else {
        res.sendStatus(200);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error updating user");
    });
};


module.exports = {
    getUsers,
    usersId,
    postUsers,
    putUsers,
};