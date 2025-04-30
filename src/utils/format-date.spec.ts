import { formatDate } from "./format-date";

describe("format date function", () => {
    it("should return date in Brazilian format", () => {
        const today = new Date(); 
        const day = today.getUTCDate();
        const month = today.getUTCMonth() + 1;
        const year = today.getUTCFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        const result = formatDate(today);

        expect(result).toBe(formattedDate);
    })

    it("should not return date in brasilian format with leading zero", () => {
        const today = new Date(2023, 0, 1); // January 1, 2023
        const day = today.getUTCDate();
        const month = today.getUTCMonth() + 1;
        const year = today.getUTCFullYear();
        const formattedDate = `0${day}/0${month}/${year}`;

        const result = formatDate(today);

        expect(result).not.toBe(formattedDate);
    })
})