var faunadb = require('faunadb'),
q = faunadb.query;

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {

  // if (event.httpMethod !== "POST") {
  //   return { statusCode: 405, body: "Method Not Allowed" };
  // }

  try {
    const employee = JSON.parse(event.body);
    var adminClient = new faunadb.Client({ secret: process.env.faunadbKey });

    const result = await adminClient.query(
        q.Create(
        q.Collection('employees'),
        { data: { name:  employee.empName, age: employee.empAge, salary: employee.empSalary} },
      )
     )
    
    return {
      statusCode: 200,
      // body: JSON.stringify({ message:  result.ref.id}),
      body: JSON.stringify({ newEmp:  result}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
