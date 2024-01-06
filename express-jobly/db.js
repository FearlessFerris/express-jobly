// Setup Database 

const { Client } = require( 'pg' );

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///jobly_demo_test";
} else {
  DB_URI = "postgresql:///jobly_demo";
}

let db = new Client({
  user: 'marcus',
  password: 'Civil392601*',
  hostname: 'localhost',
  database: 'jobly_demo',
  port: 5432
});

db.connect();

module.exports = db;