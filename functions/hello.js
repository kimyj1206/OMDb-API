exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: "kyj",
      age: 22,
      email: "kimyj1592@naver.com"
    })
  }
}