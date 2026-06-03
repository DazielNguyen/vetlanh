/**
 * Minimal JWT fixture builder.
 *
 * jwt-decode only needs the second segment (payload) to be valid base64url JSON.
 * The header and signature are not validated by the library, so we use dummy
 * values for them.
 */

function b64url(obj: object): string {
  const json = JSON.stringify(obj);
  // Buffer is available in Node test environment
  return Buffer.from(json)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const DUMMY_HEADER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // {"alg":"HS256","typ":"JWT"}
const DUMMY_SIG = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function buildJwt(payload: object): string {
  return `${DUMMY_HEADER}.${b64url(payload)}.${DUMMY_SIG}`;
}

/** Returns a Unix timestamp N seconds from now. */
export function futureExp(secondsFromNow = 3600): number {
  return Math.floor(Date.now() / 1000) + secondsFromNow;
}

/** Returns a Unix timestamp N seconds in the past. */
export function pastExp(secondsAgo = 3600): number {
  return Math.floor(Date.now() / 1000) - secondsAgo;
}
