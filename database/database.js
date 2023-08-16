const dotenv = require('dotenv').config();
const mysql = require('mysql2');

class Database{

    connect(){
        const connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database : process.env.DATABASE_NAME
        });
        return connection;
    }

    GetFirst(query){
        return new Promise((resolve, reject) => {
            this.connect().query(query, (err, result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result[0]);
                }
            });
        });
    }

    GetAll(query){
        return new Promise((resolve, reject) => {
            this.connect().query(query, (err, result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }
}

module.exports = new Database();