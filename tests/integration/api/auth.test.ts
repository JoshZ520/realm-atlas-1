/**
 * Integration tests for POST /api/auth/register
 * These require a running database. Run with: npm test -- --testPathPattern=auth
 */

// Placeholder — implement with test DB setup in T019
describe("POST /api/auth/register", () => {
  it.todo("returns 201 with valid credentials");
  it.todo("returns 409 when username already exists");
  it.todo("returns 400 when username is invalid");
  it.todo("returns 400 when password is too short");
});

describe("NextAuth sign-in", () => {
  it.todo("returns session for valid credentials");
  it.todo("returns error for invalid password");
  it.todo("returns error for non-existent user");
});
