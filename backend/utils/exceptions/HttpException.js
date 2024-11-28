// Class to throw HttpExceptions instead of Errors
class HttpException extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
