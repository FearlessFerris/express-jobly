// Middleware for Authentification 
// Used to verify and login users through middleware rather than recreating jwt for each route several times

const jwt = require( 'jsonwebtoken' );
const SECRET_KEY = 'imsosecret';
const { UnauthorizedError } = require( '../expressError' );


const checkJWT = ( req, res, next ) => {
    try{
        const header = req.headers
        console.log( header )
    }
    catch( e ){
        return next( e )
    }
}

module.exports = checkJWT;