const jwt = require('jsonwebtoken');
const express = require('express');


const auth = (req, res, next) => {
    if (req.path.includes('login') || req.path.includes('register')) {
        next();
        return;
    }
    const authorization = req.header.authorization;

    if (authorization) {
        const [scheme, token] = authorization.split(' ');
        if (token) {
            const secretKey = username;
            jwt.verify(token, secretKey, (err, user) => {
                if (err) {
                    res.status(401).json();
                }
                next();
            });
        }
    }
    res.status(401).json();
}

module.exports = auth;