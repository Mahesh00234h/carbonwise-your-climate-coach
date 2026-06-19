import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("handles conditional inputs", () => {
    const truthy = true as boolean;
    const falsy = false as boolean;
    expect(cn("a", falsy && "b", null, undefined, truthy && "c")).toBe("a c");
    expect(cn(["a", ["b", { c: true, d: false }]])).toBe("a b c");
  });
});
