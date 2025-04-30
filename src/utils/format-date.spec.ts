import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("should format date correctly", () => {
    const date = new Date("2023-11-10");
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("10/11/2023");
  });

  it("should handle invalid date", () => {
    const date = new Date("invalid-date");
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("NaN/NaN/NaN");
  });

  it("should handle date with time", () => {
    const date = new Date("2023-11-10T12:00:00Z");
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("10/11/2023");
  });
});
