import { HttpJsonError } from "../service/http/HttpError";

export const getErrorMessage = (e: HttpJsonError): string => {
  switch (e.tag) {
    case "httpRequestError":
      return "Failed to connect to server";
    case "httpContentTypeError":
      return "Unexpected response from server";
    case "httpResponseStatusError":
      return `Request failed with status: ${e.status}`;
    case "decodeError":
      return `Failed to decode response JSON`;
  }
};
