import {CustomError}  from './custom-error';


export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to Database';
  statusCode = 500;

  constructor () {
    super('Error connecting to DB');
    // Because we're extendting a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  } 

  serializeErrors() {
    return [
      {message: this.reason}
    ];
  }
}