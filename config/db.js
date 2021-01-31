//DATABASE Connection
const mysql = require("mysql");

const connection = mysql
    .createConnection({
        host: 'localhost', // HOST NAME
        user: 'root', // USER NAME
        password: '', // DATABASE PASSWORD
        database: 'sisapi_db', // DATABASE NAME
    })
    .on("error", (err) => {
        console.log('Failed to connect to Database - ', err);
    });

module.exports = connection;