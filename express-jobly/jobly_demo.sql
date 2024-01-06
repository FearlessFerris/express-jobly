\echo 'Preparing to seed jobly_demo database' 
-- Display what this file is doing to the user

\echo 'Running this file will delete any information associated with jobly_demo database and create a new' 
-- Inform the consequences of running this file to the user 

\echo 'Press ctrl + c to stop this operation'

DROP DATABASE jobly_demo; -- Drop and previous database with the name jobly_demo
CREATE DATABASE jobly_demo; -- Create a new database named jobly_demo

\c jobly_demo
-- Connect to the jobly_demo database 

\i jobly-schema.sql 
-- Include / Read / Execute this file 

\i jobly-seed.sql 
-- Include / Read / Execute this file 





