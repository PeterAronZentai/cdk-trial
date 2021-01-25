exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    return {
        statusCode: 200,
        headers: {
            contentType: 'application/json'  
          },        
        body: JSON.stringify({
            ok: 1
        })
    }
}