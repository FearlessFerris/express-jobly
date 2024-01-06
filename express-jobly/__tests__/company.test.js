const db = require( '../db' ); // Require Database to modify the information and test database functionality 
const { BadRequestError, NotFoundError } = require( '../expressError' ); // Require Express Error Extended Model 
const Company = require( '../models/company' ); // Require Compamy Model 




// Test Suite for the entire Company Model 
describe( 'Company Model Tests', function () {

    // Test Suite for the filterEmp method
    describe( 'Testing filterEmp Static Method', function(){
        
        /* 
            - Notice that these tests are asynchronous due to the nature of the filterEmp static method on the Company Class
            - DB Queries are asynchronous and the filterEmp method on the Company Class uses a query to return results 
            based on a filter object of user specified data
        */

       // Test 1 
       test( 'filterEmp with name and default min / max', async function (){
           
           // Create the filter object 
           const filter = {
               name: 'hall-davis',
               min: 0,
               max: 1000
            };
            
            // Call filterEmp on the Company Class 
            const results = await Company.filterEmp( filter );
            
            // Expect the passed in filter object to be equal to the expected filter object 
            expect( filter ).toEqual({
                name: 'hall-davis', 
                min: 0,
                max: 1000
            });
            
            // Expect the results object to match that of the expected results object 
            expect( results[0] ).toMatchObject({
                handle: 'hall-davis',
                name: 'Hall-Davis',
                description: 'Adult go economic off into. Suddenly happy according only common. Father plant wrong free traditional.',
                numEmployees: 749,
                logoUrl: '/logos/logo2.png'
            });
            
        });
        
    // Test 2 
    test( 'filterEmp with a partial name entry upper case', async function (){
        
        // Create the filter object 
        const filter = {
            name: 'GAR',
            min: 0,
            max: 1000
        }
        
        // Call filterEmp on the Company Class 
        const results = await Company.filterEmp( filter )
        
        // Expect the passed in filter object to be equal to the expected filter object 
        expect( filter ).toEqual({
            name: 'GAR',
            min: 0,
            max: 1000
        });
        
        // Expect the results object to match that of the expected results object 
        expect( results ).toMatchObject(
            [
                {
                    handle: 'garcia-ray',
                    name: 'Garcia-Ray',
                    description: 'Laugh low follow fear. Politics main size fine.',
                    numEmployees: 217,
                    logoUrl: '/logos/logo2.png'
                },
                {
                    handle: 'garner-michael',
                    name: 'Garner-Michael',
                    description: 'Necessary thousand parent since discuss director. Visit machine skill five the.',
                    numEmployees: 940,
                    logoUrl: null
                }
            ]);
        });

    // Test 3 
    test( 'filterEmp with only partial data passed into the object', async function (){

        // Create the filter object 
        const filter = {
            name: 'moore'
        }

        // Call filterEmp on the Company Class 
        const results = await Company.filterEmp( filter );

        // Expect the passed in filter object to be equal to the expected filter object 
        expect( filter ).toEqual({
            name: 'moore'
        });

        // Expect the results object to match that of the expected results object 
        expect( results ).toMatchObject(
            [
                {
                  handle: 'moore-plc',
                  name: 'Moore PLC',
                  description: 'Magazine thing eight shake window might they organization. Environmental it bag green.',
                  numEmployees: 100,
                  logoUrl: null
                },
                {
                  handle: 'mueller-moore',
                  name: 'Mueller-Moore',
                  description: 'Edge may report though least pressure likely. Cost short appear program hair seven.',
                  numEmployees: 932,
                  logoUrl: '/logos/logo2.png'
                }
              ]
        )
    })

    // Test 4
    test( 'filterEmp without any data passed into the method object', async function (){

        // Create the filter object 
        const filter = {
            min: -100,
            maximum: -1000
        };

        /* 
            - Call filterEmp on the Company Class
            - Since this test is asynchronous you cannot directly use the toThrow matcher with an asynchronous function that returns a Promise 
            - You will need to use async / await inside of a try / catch block 
            - 
        */
        try{ // Contains the asynchronous operation 
            // Call filterEmp on the Company Class 
            const results = await Company.filterEmp( filter );
            fail( 'Expected the test to throw a BadRequestError!' ); // This line will fail the test if an error is not thrown!     
        }
        catch( error ){ // Handles the errors thrown by the function
            // Expect the thrown error to be an instance of the BadRequestError Class  
            expect( error ).toBeInstanceOf( BadRequestError );
        }
    });
    });
});
    
    
    
    