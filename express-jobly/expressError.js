// Create an ExpressError Class that extends the Error class 
class ExpressError extends Error {
    constructor( msg, status ){
        super();
        this.msg = msg;
        this.status = status;
        console.error( this.stack );
    }
}

// Not Found Error 
class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
      super(message, 404);
    }
  }
  
// Unauthorized Error 
class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
      super(message, 401);
    }
  }

// Bad Request Error 
class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
      super(message, 400);
    }
  }

// Forbidden Error 
class ForbiddenError extends ExpressError {
    constructor(message = "Bad Request") {
      super(message, 403);
    }
  }

module.exports = {
    ExpressError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError
};