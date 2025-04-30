import { sumEvenNumbers } from "./sum-even-numbers";

describe("sumEvenNumbers", () => {
  describe("at least one odd parameter", () => {
    const oddParametersTestCases = [
      { firstParameter: 1, secondParameter: 2, expectedResult: null },
      { firstParameter: 2, secondParameter: 1, expectedResult: null },
      { firstParameter: 4, secondParameter: 3, expectedResult: null },
      { firstParameter: 7, secondParameter: 1, expectedResult: null },
      { firstParameter: 9, secondParameter: 3, expectedResult: null },
      { firstParameter: 2, secondParameter: 5, expectedResult: null },
      { firstParameter: 8, secondParameter: 1, expectedResult: null },
    ];
    it.each(oddParametersTestCases)(
      "should return $expectedResult if any parameter is odd",
      ({ firstParameter, secondParameter, expectedResult }) => {
        // act
        const result = sumEvenNumbers(firstParameter, secondParameter);

        // assert
        expect(result).toBeNull();
        expect(result).toBe(null);
      },
    );
  });

  describe("both parameters are even", () => {
    const evenNumbersTestCases = [
      { firstParameter: 2, secondParameter: 2, expectedResult: 4 },
      { firstParameter: 6, secondParameter: 2, expectedResult: 8 },
      { firstParameter: 4, secondParameter: 4, expectedResult: 8 },
      { firstParameter: 10, secondParameter: 2, expectedResult: 12 },
      { firstParameter: 8, secondParameter: 6, expectedResult: 14 },
      { firstParameter: 12, secondParameter: 4, expectedResult: 16 },
    ];
    it.each(evenNumbersTestCases)(
      "should return $expectedResult if first parameter is $firstParameter and second parameter is $secondParameter",
      ({ firstParameter, secondParameter, expectedResult }) => {
        // act
        const result = sumEvenNumbers(firstParameter, secondParameter);

        // assert
        expect(result).toBe(expectedResult);
      },
    );
  });
});
