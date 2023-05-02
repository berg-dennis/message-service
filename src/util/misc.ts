import crypto from 'crypto';

export function getRandomUUID() {
  return crypto.randomUUID();
}
