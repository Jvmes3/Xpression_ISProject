export const emailRule: string;
export const passwordRule: string;
export function emailError(email: string): string;
export function passwordError(password: string): string;
export function credentialError(email: string, password: string): "" | "email" | "password";
