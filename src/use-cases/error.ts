export class AuthenticationError extends Error {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends Error {
  constructor() {
    super("Email already in use");
    this.name = "EmailInUseError";
  }
}

export class LoginError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "LoginError";
  }
}
