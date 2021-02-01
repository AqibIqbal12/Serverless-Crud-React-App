var faunadb = require('faunadb'),
q = faunadb.query;

exports.handler = async (event, context) => {

  try {
    var adminClient = new faunadb.Client({ secret: process.env.faunadbKey });
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
      body: JSON.stringify({showAllEmp: data.length === 0 ? 'Collection_is_empty' : data}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
