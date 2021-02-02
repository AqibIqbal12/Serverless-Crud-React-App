var faunadb = require('faunadb'),
    q = faunadb.query;

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {


    try {
        const employeeID = event.queryStringParameters.ID
        const updatedEmpDtls = JSON.parse(event.body);
        var adminClient = new faunadb.Client({ secret: "fnAD959afCACAz9x0wPyHF2gPFaAVYLEzTtTh7Hi" });

        const result = await adminClient.query(
            q.Update(
                q.Ref(q.Collection('employees'), employeeID),
                { data: {name: updatedEmpDtls.empName, age: updatedEmpDtls.empAge, salary: updatedEmpDtls.empSalary} }
            )
        )

        return {
            statusCode: 200,
            body: JSON.stringify({ updatedData: result }),
            // // more keys you can return:
            // headers: { "headerName": "headerValue", ... },
            // isBase64Encoded: true,
        }
    } catch (err) {
        return { statusCode: 500, body: err.toString() }
    }
}
