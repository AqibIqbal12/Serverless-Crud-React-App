var faunadb = require('faunadb'),
  q = faunadb.query;

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {

  try {
    const employeeID = event.queryStringParameters.ID
    var adminClient = new faunadb.Client({ secret: "fnAD959afCACAz9x0wPyHF2gPFaAVYLEzTtTh7Hi" });

    const result = await adminClient.query(
      q.Delete(
        q.Ref(q.Collection('employees'), employeeID)
      )
    )

    const {data} = await adminClient.query(
      q.Reverse(
        q.Map(
          q.Paginate(q.Match(q.Index('all_employees'))),
          q.Lambda(x => q.Get(x))
        )
      )
             
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ deletedEntry: data.length === 0 ? 'Collection_is_empty' : result }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
