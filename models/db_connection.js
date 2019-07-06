const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'shopping_cart'
});

db.connect(err => {
    if (err) {
        console.log('connecting error');
    } else {
        console.log('connecting success');
    }
});

module.exports = db;