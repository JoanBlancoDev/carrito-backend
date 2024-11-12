const mysql2 = require('mysql2');
require('dotenv/config.js');


const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
});

const dbConnection = () => {

    db.connect((error) => {
        if (error) {
            console.log(error , 'No connected')
        } else {
            console.log(`DB connected succesfully ${process.env.DB}`)
        }
    })
    return db;
} 
    

module.exports = { db, dbConnection };