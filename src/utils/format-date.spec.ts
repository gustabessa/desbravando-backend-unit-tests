import { formatDate } from "./format-date";

interface SetupType {
  returnValidDate: boolean;
  day: string;
  month: string;
  year: string;
  auxDate?: string;
}

const setup = ({
  returnValidDate = true,
  day,
  month,
  year,
  auxDate,
}: SetupType) => {
  const date = returnValidDate
    ? `${year}-${month}-${day}${auxDate ? auxDate : ""}`
    : "invalid-date";

  const formattedDateFn = returnValidDate
    ? `${day}/${month}/${year}`
    : "Invalid Date";

  return {
    date,
    formattedDateFn,
  };
};

describe("formatDate", () => {
  it("should format date correctly", () => {
    const { date, formattedDateFn } = setup({
      returnValidDate: true,
      month: "10",
      year: "2023",
      day: "1",
    });
    const formattedDate = formatDate(new Date(date));
    expect(formattedDate).toBe(formattedDateFn);
  });

  it("should handle invalid date", () => {
    const { date, formattedDateFn } = setup({
      returnValidDate: false,
      month: "10",
      year: "2023",
      day: "1",
    });
    const formattedDate = formatDate(new Date(date));
    expect(formattedDate).toBe(formattedDateFn);
  });

  it("should handle date with timezone", () => {
    const { date, formattedDateFn } = setup({
        returnValidDate: false,
        month: "10",
        year: "2023",
        day: "1",
        auxDate: "T12:00:00Z"
      });
    const formattedDate = formatDate(new Date(date));
    expect(formattedDate).toBe(formattedDateFn);
  });
});
