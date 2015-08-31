
class AppError {
  constructor(error) {
    this.user = "testuser";
    this.error = error;
    this.dtg = new Date();
    this.message = error;

    //TODO: Add LogEntries logging here
  }

  getError() {
    return new Error(this.message);
  }
}

module.exports = AppError;
