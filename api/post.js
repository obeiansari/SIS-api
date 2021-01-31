const express = require('express');
// const mysql = require('mysql');
const router = express.Router();
const connection = require('../config/db');

router.get('/getAll', (req, res) => {
    const query = 'SELECT * FROM post ORDER BY id DESC;';
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json(error);
        }
        console.log('post hello');
        res.json(results);
    });
});

router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM post WHERE id = ?;`;
    connection.query(query, [id], (error, results) => {
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

router.post('/create', (req, res) => {
    const title = req.body.title;
    const body = req.body.body;

    if (!title || !body) {
        res.status(400).json();
    }

    const query = `INSERT INTO post SET ?;`;
    connection.query(query, req.body, (error, results) => {
        if (error) {
            res.status(500).json(error);
        }
        const location = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + results.insertId;
        res.setHeader('Location', location);
        const body = req.body;
        body.id = results.insertId;
        res.status(201).json(body);
    });
});

router.put('/edit/:id', (req, res) => {
    const id = +req.params.id;
    const title = req.body.title;
    const body = req.body.body;

    // if (id !== +req.body.id) {
    //     res.status(400).json("id alag hai");
    // }
    if (!title || !body) {
        res.status(400).json();
    }
    const query = `UPDATE post SET title = ?, body = ? WHERE id = ?;`;
    connection.query(query, [title, body, id], (error, results) => {
        if (error) {
            res.status(500).json(error);
        }
        if (results.affectedRows === 0) {
            res.status(404).json();
        } else {
            res.json(req.body);
        }
    });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM post WHERE id = ?;`;
    connection.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json(error);
        }
        if (results.affectedRows === 0) {
            res.status(404).json();
        } else {
            res.json();
        }
    });
});

module.exports = router;