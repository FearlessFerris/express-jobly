"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

// if (process.env.NODE_ENV === "production") {
//   db = new Client({
//     connectionString: getDatabaseUri(),
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
// } else {
//   db = new Client({
//     connectionString: getDatabaseUri()
//   });
// }

if ( process.env.NODE_ENV === "production" ){
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
}
else{
  db = new Client({
    "username": "marcus",
    "password": "USSKennedy23",
    "hostname": "localhost",
    "database": "jobly",
    "port": 5432
  }); 
}

db.connect();

module.exports = db;