import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("should format date to dd/mm/yyyy", () => {
    const date = new Date("2023-10-01");
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("1/10/2023");
  });
});
