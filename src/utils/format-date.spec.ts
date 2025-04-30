import { formatDate } from "./format-date";

describe("formatDate", () => {
  const cases = [
    { date: new Date("2023-10-01"), expected: "1/10/2023" },
    { date: new Date("2023-01-01"), expected: "1/1/2023" },
    { date: new Date("2023-12-31"), expected: "31/12/2023" },
    { date: new Date("2023-06-15"), expected: "15/6/2023" },
    { date: new Date("2023-11-11"), expected: "11/11/2023" },
  ];

  it.each(cases)(
    "should format date $date to $expected",
    ({ date, expected }) => {
      // act
      const result = formatDate(date);

      // assert
      expect(typeof result).toBe("string");
      expect(result).toBe(expected);
    }
  );
});
