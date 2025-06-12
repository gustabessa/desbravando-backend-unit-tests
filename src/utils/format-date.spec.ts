import { formatDate } from "./format-date";

const testCases = [
  { date: new Date("2023-01-01"), expected: "1/1/2023" },
  { date: new Date("2023-02-28"), expected: "28/2/2023" },
  { date: new Date("2023-03-15"), expected: "15/3/2023" },
  { date: new Date("2023-04-30"), expected: "30/4/2023" },
  { date: new Date("2025-05-05"), expected: "5/5/2025" },
  { date: new Date("2023-06-20"), expected: "20/6/2023" },
  { date: new Date("2023-07-10"), expected: "10/7/2023" },
  { date: new Date("2023-08-25"), expected: "25/8/2023" },
  { date: new Date("2023-09-12"), expected: "12/9/2023" },
  { date: new Date("2023-10-31"), expected: "31/10/2023" },
];

const testCasesWithWrongDates = [
  { date: new Date("2025-02-30"), expected: "30/2/2023" },
  { date: new Date("2025-13-01"), expected: "Invalid date" },
  { date: new Date("2025-00-01"), expected: "Invalid date" }, 
  { date: new Date("2025-01-32"), expected: "Invalid date" },
];

describe("formatDate with multiple test cases", () => {
  testCases.forEach(({ date, expected }) => {
    it(`should format ${date.toISOString()} to ${expected}`, () => {
      const result = formatDate(date);
      expect(result).toBe(expected);
    });
  });
  testCasesWithWrongDates.forEach(({ date, expected }) => {
    it(`should return ${expected} for wrong date ${date}`, () => {
      const result = formatDate(date);
      expect(result).not.toBe(expected);
    });
  });
});
