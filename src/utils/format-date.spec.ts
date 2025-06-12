import { formatDate } from "./format-date";

it("should format date correctly", () => {
  const date = new Date("2023-02-01");
  const formattedDate = formatDate(date);
  expect(formattedDate).toBe("1/2/2023");
});

it("should handle UTC dates correctly", () => {
  const date = new Date(Date.UTC(2023, 6, 15));
  const formattedDate = formatDate(date);
  expect(formattedDate).toBe("15/7/2023");
});

it("should handle invalid dates", () => {
  const date = new Date("invalid-date");
  const formattedDate = formatDate(date);
  expect(formattedDate).toBe("Invalid Date");
});
