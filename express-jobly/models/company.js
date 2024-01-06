const db = require( '../db' ); // Require Database Connection 
const { BadRequestError, ExpressError, NotFoundError } = require( '../expressError' )

// Company Class 
class Company {
    // { handle, name, description, numEmployees, logoUrl }

    // Create Method 
    static async create({ handle, name, description, numEmployees, logoUrl }){
        const dupCheck = await db.query( 
            `SELECT handle
             FROM companies
             WHERE handle = $1`,
             [ handle ]);

        if( dupCheck.rows[0] ){
            throw new BadRequestError( `Error Duplicate Name: ${ handle } exists already`, 400 )
        }

        const result = await db.query( 
            /*  
                1.) Select Table to Insert Rows into 
                2.) Specify the values to be inserted into the columns 
                3.) Return values from the affected rows in the database 
            */ 
            `INSERT INTO companies
             ( handle, name, description, numEmployees, logoUrl )
             VALUES ( $1, $2, $3, $4, $5 )
             RETURNING handle, name, description, num_employees AS 'numEmployees', logo_url AS 'logoUrl'`,
             [ handle, name, description, numEmployees, logoUrl ]
        );
        const company = result.rows[0];
        return company;
    }

    // Find a specific company / not case sensitive / will return company containing the handle passed in ( does not have to be an exact match but will only return one company )
    static async findOne( handle ){
        const results = await db.query( 
            `SELECT handle
             FROM companies 
             WHERE handle ILIKE $1`,
             [ `%${ handle }%` ]);

        if( !results.rows === 0 ){
            throw new NotFoundError( `${ handle } not currently in use `, 404 )
        }

        const company = results.rows[0]
        return company
    }

    // Filters based off of an entered minimum or maximum number of employees 
    static async filterEmp( filters = {} ){
        const { name, min, max } = filters;
        let query = `SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
                     FROM companies`;
        
        let where = [];
        let values = [];

        if( min !== undefined && max !== undefined && min > max ){
            throw new BadRequestError( 'Minimum number of employees cannot exceed the value of maximum number of employees!' );
        }

        if( min || max < 0 ){
            throw new BadRequestError( 'Your Minimum and Maximum values cannot be negative numbers!' );
        }
        
        if( name ){
            values.push( `%${ name }%`);
            where.push( `name ILIKE $${ values.length }` )
        }

        if( min !== undefined ){
            values.push( min );
            where.push( `num_employees >=$${ values.length }` )
            console.log( query, where, values )
        }
        
        if( max !== undefined ){
            values.push( max )
            where.push( `num_employees <= $${ values.length}` )
        }

        
        if( where.length > 0 ){
            query +=  ' WHERE ' + where.join( ' AND ' );
        }
        
        query += ' ORDER BY name';
        const results = await db.query( query, values );
        console.log( `Query: ${ query }  Where: ${ where.join( ' AND ') } Values: ${ values }` )
        return results.rows;
    }

    
}


module.exports = Company;