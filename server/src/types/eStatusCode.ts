enum eStatusCode {
  'ok' = 200,
  'created' = 201,
  'no content' = 204,

  'bad request' = 400,
  'unauthorized' = 401,
  'forbidden' = 403,
  'not found' = 404,
  'request timeout' = 408,
  'too many request' = 429,

  'internal server error' = 500,
  'bad gateway' = 502,
}

export default eStatusCode;
