import { DecodeError } from "../../utils/decode";
import { E, pipe, RTE, TE } from "../../utils/fpts";
import {
  HttpContentTypeError,
  HttpJsonError,
  HttpRequestError,
  httpresponseStatusError,
  HttpResponseStatusError,
} from "./HttpError";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface HttpRequest {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
}

export interface HttpResponse {
  status: number;
  headers?: Record<string, string>;
  getBodyAsJson: TE.TaskEither<HttpContentTypeError<"json">, unknown>;
  getBodyAsText: TE.TaskEither<HttpContentTypeError<"text">, unknown>;
}

export interface HttpClient {
  sendRequest(
    request: HttpRequest
  ): TE.TaskEither<HttpRequestError, HttpResponse>;
}

export interface HttpClientEnv {
  httpClient: HttpClient;
}

export const sendRequest = (
  httpRequest: HttpRequest
): RTE.ReaderTaskEither<HttpClientEnv, HttpRequestError, HttpResponse> =>
  pipe(
    RTE.asks((m: HttpClientEnv) => m.httpClient),
    RTE.chainTaskEitherKW((httpClient) => httpClient.sendRequest(httpRequest))
  );

export const ensureStatusChange =
  (minInclusive: number, maxExclusive: number) =>
  (
    httpResponse: HttpResponse
  ): E.Either<HttpResponseStatusError, HttpResponse> =>
    httpResponse.status >= minInclusive && httpResponse.status < maxExclusive
      ? E.right(httpResponse)
      : E.left(
          httpresponseStatusError(
            httpResponse,
            httpResponse.status,
            minInclusive,
            maxExclusive
          )
        );

export const ensure2xx = ensureStatusChange(200, 300);

export const getJson = <A>(
  url: string,
  decode: (raw: unknown) => E.Either<DecodeError, A>
): RTE.ReaderTaskEither<HttpClientEnv, HttpJsonError, A> =>
  pipe(
    sendRequest({ method: "GET", url }),
    RTE.chainEitherKW(ensure2xx),
    RTE.chainTaskEitherKW((response) => response.getBodyAsJson),
    RTE.chainEitherKW(decode)
  );
