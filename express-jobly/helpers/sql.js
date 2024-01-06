const { BadRequestError } = require("../expressError");

/** 
@param dataToUpdate is an object that is passed in with the field(s) that need to be updated
                    and the new values that the fields need to updated to
                    Ex: { field: value, field: value }

@param jsToSql is an object that turns the js data into actual database column names 
               Ex: { username: "username", password: "password" }

              Working example:

              { username: 'JamesBond', password: '007' } => 
              { setCols: '"username"=$1, "password"=$2', values: [ 'JamesBond', '007' ]}
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
