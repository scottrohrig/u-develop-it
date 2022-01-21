const mysql = require( 'mysql2' );
require('dotenv').config();

const {MYSQL_UN, MYSQL_PW} = process.env;

// Connect to database
const db = mysql.createConnection( {
    host: 'localhost',
    user: MYSQL_UN,
    password: MYSQL_PW,
    database: 'election'
} );

module.exports = db;