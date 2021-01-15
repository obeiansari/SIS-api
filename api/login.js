const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const register = require('../data/register.json');

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?;';
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sisapi_db'
    });
    connection.connect();
    console.log(username, password);
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            res.status(500).json(error);
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json(null);
        }
    });
});
module.exports = router;