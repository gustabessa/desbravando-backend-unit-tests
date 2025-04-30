import { formatDate } from "./format-date";

describe("format-date", () => {
  it("should format date with single-digit day and month", () => {
    const date = new Date(2025, 0, 5); // January 5, 2025
    expect(formatDate(date)).toBe("5/1/2025");
  });

  it("should format date with two-digit day and month", () => {
    const date = new Date(2025, 11, 25); // December 25, 2025
    expect(formatDate(date)).toBe("25/12/2025");
  });

  it("should format date at year boundaries", () => {
    const newYearsEve = new Date(2025, 11, 31); // December 31, 2025
    const newYearsDay = new Date(2026, 0, 1); // January 1, 2026

    expect(formatDate(newYearsEve)).toBe("31/12/2025");
    expect(formatDate(newYearsDay)).toBe("1/1/2026");
  });
  it("should format date in now", () => {
    const now = new Date(); // Current date

    expect(formatDate(now)).toBe("30/4/2025");
  });
});
