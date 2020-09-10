module.exports = function interpolateParams (req) {
  // Un-null APIG-proxy-Lambda params in 6+
  if (req.body === null)
    req.body = {}
  if (req.pathParameters === null)
    req.pathParameters = {}
  if (req.queryStringParameters === null)
    req.queryStringParameters = {}
  if (req.multiValueQueryStringParameters === null)
    req.multiValueQueryStringParameters = {}

  // Backfill params generated by <6 VTL
  if (!req.method)
    req.method = req.httpMethod
  if (!req.params)
    req.params = req.pathParameters
  if (!req.query)
    req.query = req.queryStringParameters

  // Legacy path parameter interpolation; 6+ gets this for free in `req.path`
  var params = /\{\w+\}/g
  if (params.test(req.path)) {
    var matches = req.path.match(params)
    var vars = matches.map(a => a.replace(/\{|\}/g, ''))
    var idx = 0
    matches.forEach(m => {
      req.path = req.path.replace(m, req.params[vars[idx]])
      idx += 1
    })
  }
  return req
}
