/**
 * Make some properties required on type
 *
 * @example
 * ```typescript
 * interface User {
 * 	id: string;
 * 	email: string;
 * 	password: string;
 * }
 *
 * RequiredFields<User, "email" | "password">;
 * ```
 */

export type RequiredFields<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;
