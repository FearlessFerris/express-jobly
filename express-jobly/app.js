// Main Application Setup
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 3000;
const { ExpressError, NotFoundError } = require( './expressError' );
const morgan = require( 'morgan' );


// Routers
const companyRoutes = require( './routes/companies' ); // Require the company routes to apply prefix 

// Setup Application Middleware 
app.use( express.json() ); // Parses incoming JSON payloads from requests and attaches it to the req.body property 
app.use( '/companies', companyRoutes );  // Apply Company Routes Prefix 
app.use( morgan( 'tiny' )); // HTTP request logger 

// Application Routes 
app.get( '/', ( req, res, next ) =>{
    return res.json({ Welcome: 'To the applications homepage' })
});

// 404 Error
app.use( ( req, res, next ) => {
    const notFound = new NotFoundError( 'Not Found!', 404 )
});

// General Error Handler
app.use( (err, req, res, next ) => {
    let status = err.status || 500;
    let msg = err.msg;
    return res.status( status ).json({ error: { msg, status }})
});

// Export Application 
module.exports = { app, port };



