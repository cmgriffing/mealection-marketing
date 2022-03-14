//
// Copyright (C) Fabian Lauer, 2018
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NO
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//

export const enum HTTPStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,

  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  IMUsed = 226,

  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  SwitchProxy = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,

  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,

  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export type HTTPInformationalResponses =
  | HTTPStatusCode.Continue
  | HTTPStatusCode.SwitchingProtocols
  | HTTPStatusCode.Processing
  | HTTPStatusCode.EarlyHints;

export type HTTPSuccessResponses =
  | HTTPStatusCode.OK
  | HTTPStatusCode.Created
  | HTTPStatusCode.Accepted
  | HTTPStatusCode.NonAuthoritativeInformation
  | HTTPStatusCode.NoContent
  | HTTPStatusCode.ResetContent
  | HTTPStatusCode.PartialContent
  | HTTPStatusCode.MultiStatus
  | HTTPStatusCode.AlreadyReported
  | HTTPStatusCode.IMUsed;

export type HTTPRedirectionResponses =
  | HTTPStatusCode.MultipleChoices
  | HTTPStatusCode.MovedPermanently
  | HTTPStatusCode.Found
  | HTTPStatusCode.SeeOther
  | HTTPStatusCode.NotModified
  | HTTPStatusCode.UseProxy
  | HTTPStatusCode.SwitchProxy
  | HTTPStatusCode.TemporaryRedirect
  | HTTPStatusCode.PermanentRedirect;

export type HTTPClientErrorResponses =
  | HTTPStatusCode.BadRequest
  | HTTPStatusCode.Unauthorized
  | HTTPStatusCode.PaymentRequired
  | HTTPStatusCode.Forbidden
  | HTTPStatusCode.NotFound
  | HTTPStatusCode.MethodNotAllowed
  | HTTPStatusCode.NotAcceptable
  | HTTPStatusCode.ProxyAuthenticationRequired
  | HTTPStatusCode.RequestTimeout
  | HTTPStatusCode.Conflict
  | HTTPStatusCode.Gone
  | HTTPStatusCode.LengthRequired
  | HTTPStatusCode.PreconditionFailed
  | HTTPStatusCode.PayloadTooLarge
  | HTTPStatusCode.URITooLong
  | HTTPStatusCode.UnsupportedMediaType
  | HTTPStatusCode.RangeNotSatisfiable
  | HTTPStatusCode.ExpectationFailed
  | HTTPStatusCode.ImATeapot
  | HTTPStatusCode.MisdirectedRequest
  | HTTPStatusCode.UnprocessableEntity
  | HTTPStatusCode.Locked
  | HTTPStatusCode.FailedDependency
  | HTTPStatusCode.UpgradeRequired
  | HTTPStatusCode.PreconditionRequired
  | HTTPStatusCode.TooManyRequests
  | HTTPStatusCode.RequestHeaderFieldsTooLarge
  | HTTPStatusCode.UnavailableForLegalReasons;

export type HTTPServerErrorResponses =
  | HTTPStatusCode.InternalServerError
  | HTTPStatusCode.NotImplemented
  | HTTPStatusCode.BadGateway
  | HTTPStatusCode.ServiceUnavailable
  | HTTPStatusCode.GatewayTimeout
  | HTTPStatusCode.HTTPVersionNotSupported
  | HTTPStatusCode.VariantAlsoNegotiates
  | HTTPStatusCode.InsufficientStorage
  | HTTPStatusCode.LoopDetected
  | HTTPStatusCode.NotExtended
  | HTTPStatusCode.NetworkAuthenticationRequired;
