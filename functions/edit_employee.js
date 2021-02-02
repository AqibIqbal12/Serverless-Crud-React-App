var faunadb = require('faunadb'),
  q = faunadb.query;

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {


  try {
    const employeeID = event.queryStringParameters.ID
    var adminClient = new faunadb.Client({ secret: "fnAD959afCACAz9x0wPyHF2gPFaAVYLEzTtTh7Hi" });

    const result = await adminClient.query(
        q.Get(q.Ref(q.Collection('employees'), employeeID))
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ res: result }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
