import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("deve formatar a data corretamente", () => {
    const date = new Date("2025-04-30");

    const result = formatDate(date);

    expect(result).toBe("30/4/2025");
  });

  it("deve formatar corretamente datas com dia e mes com um digito", () => {
    const date = new Date("2025-01-05");

    const result = formatDate(date);

    expect(result).toBe("5/1/2025");
  });

  it("deve formatar corretamente datas com dia e mes com dois digitos", () => {
    const date = new Date("2025-12-31");

    const result = formatDate(date);

    expect(result).toBe("31/12/2025");
  });
});
