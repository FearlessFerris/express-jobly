// Tests for sqlForPartialUpdate Functionality 
const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require( '../expressError' );

describe( 'Testing sqlForPartialUpdate Functionality', ()=> {

    let data;
    let jsToSql;

    beforeEach( ()=>{
        data = {
            username: "Jasmine",
            age: 23
        }

        jsToSql = {
            username: "user_name",
            age: "age"
        } 

    });

    // Test 1 
    test( 'Test 1', ()=> {
        const response = sqlForPartialUpdate( data, jsToSql )
        expect( response ).toHaveProperty( 'setCols' );
        expect( response ).toHaveProperty( 'values' );
        expect( response ).toStrictEqual( { setCols: '"user_name"=$1, "age"=$2', values: [ 'Jasmine', 23 ] } );
    });

    //Test 2 
    test( 'Test 2 ( Testing with Empty Data Object )', ()=> {
        data = {};
        expect( ()=> sqlForPartialUpdate( data, jsToSql ) ).toThrowError( BadRequestError );
    });

    // Test 3 
    test( 'Test 3 ( Key without corresponding jsToSql Mapping', ()=> {
        data = {
            username: "Chelsea",
            age: 25,
            unknownItem: "imunknown"
        }
        const response = sqlForPartialUpdate( data, jsToSql )
        expect( data ).toEqual( {
            username: "Chelsea",
            age: 25,
            unknownItem: "imunknown"
        });
        expect( response ).toEqual(  {
            setCols: '"user_name"=$1, "age"=$2, "unknownItem"=$3',
            values: [ 'Chelsea', 25, 'imunknown' ]
          });
    });

})

