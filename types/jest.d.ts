import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Expect extends jest.Matchers<void> {
      toBeInTheDocument(): void;
      toBeTruthy(): void;
      toEqual(expected: any): void;
    }
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeTruthy(): R;
      toEqual(expected: any): R;
    }
  }
}

export {};

