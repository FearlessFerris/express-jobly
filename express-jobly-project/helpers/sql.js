const { BadRequestError } = require("../expressError");


/* 
    sqlForPartialUpdate Functionality 
      - Takes two datasets ( dataToUpdate, jsToSql )
      - Extracts an array of the ( dataToUpdate ) object
      - If Keys: will map each key into an SQL Column Value Pair
        Ex.) const data = {
          username: "James Bond",
          age: 23
        }

        const jsToSql = {
          username: "user_name",
          age: "age"
        }

        cols = [ '"user_name"=$1', '"age"=$2' ]
      - Will return all of the column names in a concatenated array 
        and all of the updated data values in the form of an object
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
