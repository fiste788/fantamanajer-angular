function dec2hex(dec: number): string {
  return `0${dec.toString(16)}`.slice(-2);
}

export function buildNonce(): string {
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  const values = Array.from(arr, dec2hex);

  return [btoa(values.slice(0, 5).join('')).slice(0, 14), btoa(values.slice(5).join(''))].join('/');
}
