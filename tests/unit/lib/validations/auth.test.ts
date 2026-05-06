import { registerSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  describe("username", () => {
    it("accepts valid alphanumeric usernames", () => {
      const result = registerSchema.safeParse({
        username: "DungeonMaster42",
        password: "Secret1234",
      });
      expect(result.success).toBe(true);
    });

    it("accepts usernames with underscores", () => {
      const result = registerSchema.safeParse({
        username: "dungeon_master",
        password: "Secret1234",
      });
      expect(result.success).toBe(true);
    });

    it("rejects usernames shorter than 3 characters", () => {
      const result = registerSchema.safeParse({
        username: "ab",
        password: "Secret1234",
      });
      expect(result.success).toBe(false);
    });

    it("rejects usernames longer than 50 characters", () => {
      const result = registerSchema.safeParse({
        username: "a".repeat(51),
        password: "Secret1234",
      });
      expect(result.success).toBe(false);
    });

    it("rejects usernames with spaces", () => {
      const result = registerSchema.safeParse({
        username: "dungeon master",
        password: "Secret1234",
      });
      expect(result.success).toBe(false);
    });

    it("rejects usernames with special characters", () => {
      const result = registerSchema.safeParse({
        username: "dungeon@master",
        password: "Secret1234",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("password", () => {
    it("accepts passwords with at least 8 chars, one letter and one number", () => {
      const result = registerSchema.safeParse({
        username: "valid_user",
        password: "Password1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects passwords shorter than 8 characters", () => {
      const result = registerSchema.safeParse({
        username: "valid_user",
        password: "Pass1",
      });
      expect(result.success).toBe(false);
    });

    it("rejects passwords with only letters", () => {
      const result = registerSchema.safeParse({
        username: "valid_user",
        password: "PasswordOnly",
      });
      expect(result.success).toBe(false);
    });

    it("rejects passwords with only numbers", () => {
      const result = registerSchema.safeParse({
        username: "valid_user",
        password: "12345678",
      });
      expect(result.success).toBe(false);
    });
  });
});
