
export enum Status {
  // Successful responses (200–299)
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,

  // Client error responses (400–499)
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  RequestTimeout = 408,
  Conflict = 409,
  TooManyRequests = 429,
  // Server error responses (500–599)
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTiemout = 504,
}
