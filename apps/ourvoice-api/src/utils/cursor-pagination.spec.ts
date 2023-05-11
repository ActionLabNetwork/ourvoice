import { cursorToNumber, numberToCursor } from './cursor-pagination';

describe('CursorPagination', () => {
  // Tests that the function returns a base64 encoded string for a non-negative integer input.
  it('test_happy_path_non_negative_integer', () => {
    const result = numberToCursor(123);
    expect(result).toMatch(/[A-Za-z0-9+/]+={0,2}/); // regex to match base64 encoded string
  });

  // Tests that the function returns a base64 encoded string for an input of 0.
  it('test_happy_path_zero', () => {
    const result = numberToCursor(0);
    expect(result).toMatch(/[A-Za-z0-9+/]+={0,2}/); // regex to match base64 encoded string
  });

  // Tests that the function throws an error for an input that is NaN.
  it('test_edge_case_nan', () => {
    expect(() => numberToCursor(NaN)).toThrowError(
      'Invalid input: number must be a valid number',
    );
  });

  // Tests that the function returns a base64 encoded string for a large non-negative integer input.
  it('test_happy_path_large_integer', () => {
    const result = numberToCursor(999999999);
    expect(result).toMatch(/[A-Za-z0-9+/]+={0,2}/); // regex to match base64 encoded string
  });

  // Tests that the function throws an error for a negative integer input.
  it('test_edge_case_negative_integer', () => {
    expect(() => numberToCursor(-1)).toThrowError(
      'Invalid input: number must be a non-negative integer',
    );
  });

  // Tests that a valid base64 string representing a non-negative integer returns the expected parsed number.
  it('test_valid_input_returns_parsed_number', () => {
    const cursor = 'MTIzNDU2Nzg5MA=='; // base64 representation of "1234567890"
    const result = cursorToNumber(cursor);
    expect(result).toBe(1234567890);
  });

  // Tests that an empty string input throws an error.
  it('test_empty_string_input_throws_error', () => {
    const cursor = '';
    expect(() => cursorToNumber(cursor)).toThrowError();
  });

  // Tests that an invalid base64 string input throws an error.
  it('test_invalid_base64_string_input_throws_error', () => {
    const cursor = 'invalid_base64_string%';
    expect(() => cursorToNumber(cursor)).toThrowError();
  });

  // Tests that a negative integer input throws an error.
  it('test_negative_integer_input_throws_error', () => {
    const cursor = 'LTMyNDU2Nzg5MA=='; // base64 representation of "-1234567890"
    expect(() => cursorToNumber(cursor)).toThrowError();
  });
});
