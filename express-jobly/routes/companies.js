// Company Routes 
const express = require( 'express' ); // Require Main application 
const router = new express.Router(); // Create a new instance of the Express Router for company routes 
const db = require( '../db' ); // Require Database connection 
const checkJWT = require('../middleware/auth');
const Company = require( '../models/company' );

// Application Homepage 
router.get( '/', ( req, res, next ) => {
    return res.json({ Welcome: 'To the Companies Routes Homepage!' })
});

// Get a param name and turn into JSON response using the req.params object 
router.get( '/:company', async ( req, res, next ) => {
    try{
        const company = req.params.company
        const entry = await Company.findOne( company )
        return res.json({ entry })
    }
    catch( e ){
        return next( e );
    }
});

// Select companies based on a number of minimum or maximum employees 
router.get( '/employees/:name?/:min?/:max?', async( req, res, next ) => {
    try{
        const { name, min = 0, max = 1000 } = req.params;
        const companies = await Company.filterEmp({ name, min, max })
        console.log( companies )
        return res.json({ companies })
    }
    catch( e ){
        return next( e );
    }
});




// Export router for use elsewhere 
module.exports = router;



