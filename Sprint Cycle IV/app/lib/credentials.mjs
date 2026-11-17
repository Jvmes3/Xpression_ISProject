export const emailRule =
  "Use an email with @ and a domain, such as youremail@gmail.com or name@school.edu.";

export const passwordRule =
  "Use at least 8 characters, with 1 capital letter, 1 number, and 1 special character.";

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export function emailError(email) {
  return emailPattern.test(String(email || "").trim()) ? "" : emailRule;
}

export function passwordError(password) {
  const value = String(password || "");
  const longEnough = value.length >= 8;
  const hasCapital = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  return longEnough && hasCapital && hasNumber && hasSpecial ? "" : passwordRule;
}

export function credentialError(email, password) {
  if (emailError(email)) return "email";
  if (passwordError(password)) return "password";
  return "";
}
