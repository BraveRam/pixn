import { describe, expect, it } from "bun:test";
import {
  createImageStoragePath,
  isUserOwnedPath,
} from "../lib/gallerySecurity";

describe("isUserOwnedPath", () => {
  it("returns true for user-owned storage paths", () => {
    expect(isUserOwnedPath("user-1", "user-1/file.jpg")).toBe(true);
  });

  it("returns false for other users' paths", () => {
    expect(isUserOwnedPath("user-1", "user-2/file.jpg")).toBe(false);
  });
});

describe("createImageStoragePath", () => {
  it("sanitizes file names and prefixes user id", () => {
    const path = createImageStoragePath(
      "user-1",
      "my file (1).png",
      () => "fixed-uuid"
    );

    expect(path).toBe("user-1/fixed-uuid-my_file__1_.png");
  });
});
