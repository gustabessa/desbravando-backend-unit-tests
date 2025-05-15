import { formatDate } from "./format-date";

describe("format date function", () => {
    it("should return date in Brazilian format", () => {
        const date = new Date(2005, 6, 7); // July 7, 2005

        const result = formatDate(date);

        expect(result).toBe("7/7/2005");
    })

    it("should not return date in brasilian format with leading zero", () => {
        const date = new Date(2023, 0, 1); // January 1, 2023
        const formattedDate = `01/01/2023`;

        const result = formatDate(date);

        expect(result).not.toBe(formattedDate);
    })
})