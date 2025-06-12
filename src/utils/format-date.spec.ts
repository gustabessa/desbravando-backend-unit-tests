import { formatDate } from "./format-date";

describe( "formatDate", () => {
    it("should format date correctly", () => {
        const date = new Date(Date.UTC(2025, 10, 18));
        const formattedDate = formatDate(date);
        expect(formattedDate).toBe("18/11/2025");
    });
})