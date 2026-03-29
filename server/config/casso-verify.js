import crypto from "crypto";

function sortKeysDeep(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortKeysDeep);

  const sorted = {};
  for (const key of Object.keys(value).sort()) {
    sorted[key] = sortKeysDeep(value[key]);
  }
  return sorted;
}

export function verifyCassoSignature(rawBodyString, signatureHeader, secureToken) {
  if (!signatureHeader || !secureToken) return false;

  const parts = signatureHeader.split(",").map((part) => part.trim());
  let timestamp = "";
  let v1 = "";

  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (k === "t") timestamp = v;
    if (k === "v1") v1 = v;
  }

  if (!timestamp || !v1) return false;

  let bodyObj;
  try {
    bodyObj = JSON.parse(rawBodyString);
  } catch {
    return false;
  }

  const sorted = sortKeysDeep(bodyObj);
  const payload = JSON.stringify(sorted);
  const signPayload = `${timestamp}.${payload}`;
  const hmac = crypto.createHmac("sha512", secureToken).update(signPayload).digest("hex");

  try {
    const a = Buffer.from(hmac, "utf8");
    const b = Buffer.from(v1, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}