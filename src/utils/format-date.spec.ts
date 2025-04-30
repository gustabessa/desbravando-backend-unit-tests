import { formatDate } from "./format-date";

describe("format date function", () => {
    it("should return date in brasilian format", () => {
        const today = new Date(); 
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        const result = formatDate(today);

        expect(result).toBe(formattedDate);
    })

    it("should not return date in brasilian format with leading zero", () => {
        const today = new Date(2023, 0, 1); // January 1, 2023
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `0${day}/0${month}/${year}`;

        const result = formatDate(today);

        expect(result).not.toBe(formattedDate);
    })
})