const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10;
// const connection = require("../db-connection").promise();   //importing database file we need to require db file
const connection = require('../config/db')

router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json();
    }
    let query = `SELECT * FROM users WHERE username = ?;`;
    connection.query(query, [username], (error, results) => {
        if (error) {
            res.status(500).json(error);
        }
        if (results.length > 0) {
            // const msg = `${username} already exist`
            // user already exist
            res.status(409).json({
                message: `${username} already exist`
            });
        } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    const data = {
                        username: req.body.username,
                        password: hash
                    }
                    query = `INSERT INTO users SET ?;`;
                    console.log(data);
                    connection.query(query, data, (error, results) => {
                        if (error) {
                            res.status(500).json(error);
                            return;
                        }

                        console.log(results);
                        const body = [data];
                        body.id = results.insertId;
                        res.status(201).json(body);
                    });
                }
            });
        }
        // connection.end();
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE username = ?;`;
    connection.query(query, username, (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            if (results.length > 0) {
                const user = results[0];
                const passwordHash = user.password;

                bcrypt.compare(password, passwordHash, (error, bcryptResult) => {
                    if (error) {
                        res.status(500).json(error)
                    } else {
                        if (bcryptResult) {
                            const secretKey = 'obei123';
                            const payload = {
                                id: user.id,
                                username: user.username
                            };
                            const options = {
                                expiresIn: 3600
                            };
                            jwt.sign(payload, secretKey, options, (error, token) => {
                                if (error) {
                                    res.status(500).json(error);
                                }
                                res.status(201).json({ token, payload });

                            });
                        } else {
                            res.status(401).json();
                        }
                    }
                });
            } else {
                res.status(401).json();
            }
        }
    });
});

router.post('/authorized', (req, res) => {
    res.json({
        authorized: true
    });
});


module.exports = router;