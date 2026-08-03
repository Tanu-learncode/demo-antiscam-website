export type InputType = 'URL' | 'EMAIL' | 'PHONE' | 'TEXT';

const URL_REGEX = /^(https?:\/\/|www\.)[\w.-]+(?:\.[\w.-]+)+(?:[\/\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PHONE_REGEX = /^(\+?\d[\d\s().-]{6,})$/;

export function detectInputType(value: string): InputType {
  const normalized = value.trim();

  if (!normalized) {
    return 'TEXT';
  }

  if (URL_REGEX.test(normalized)) {
    return 'URL';
  }

  if (EMAIL_REGEX.test(normalized)) {
    return 'EMAIL';
  }

  if (PHONE_REGEX.test(normalized)) {
    return 'PHONE';
  }

  return 'TEXT';
}
