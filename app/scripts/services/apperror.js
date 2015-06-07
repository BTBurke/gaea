
class AppError {
  constructor(error) {
    this.user = "testuser";
    this.error = error;
    this.dtg = new Date();
    this.message = "The application encounted an error:\n\n" + this.error + "\n\nThis error has been reported.  Please try again later.";

    //TODO: Add LogEntries logging here
  }

  getError() {
    return new Error(this.message);
  }
}

module.exports = AppError;
