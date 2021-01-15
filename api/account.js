const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10;

router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json();
    }

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sisapi_db'
    });
    connection.connect();

    let query = `SELECT * FROM users WHERE username = ?;`;
    connection.query(query, [username], (error, results) => {
        if (error) {
            res.status(500).json(error);
        }
        if (results.length > 0) {
            // user already exist
            res.status(409).json({
                message: 'Email already exist'
            });
        } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    const data = {
                        username: req.body.username,
                        password: hash
                    }
                    query = `INSERT INTO users SET ?;`;
                    console.log(data);
                    connection.query(query, [data], (error, results) => {
                        if (error) {
                            res.status(500).json(error);
                            return;
                        }
                        console.log(results);
                        const body = data;
                        body.id = results.insertId;
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {
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
// if (req.body.username) {
//     const secretKey = username;
//     const payload = {
//         id: body.id,
//         username: req.body.username
//     };
//     const options = {
//         expiresIn: 3600
//     };
//     jwt.sign(payload, secretKey, options, (err, token) => {
//         if (err) {
//             res.status(500).json(err);
//         }
//         res.status(201).json({ body, token, hash });
//     });
// }