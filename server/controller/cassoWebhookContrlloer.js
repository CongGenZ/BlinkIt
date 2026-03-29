import { verifyCassoSignature } from "../config/casso-verify.js";
import { applyCassoTransactions, extractCassoTransactions } from "../services/paymentService.js";

const CASSO_SECURE_TOKEN = process.env.CASSO_SECURE_TOKEN || "";

export function postCassoWebhook(req, res) {
  const raw = req.body instanceof Buffer ? req.body.toString("utf8") : String(req.body || "");
  const sig = req.headers["x-casso-signature"] || req.headers["X-Casso-Signature"];

  if (CASSO_SECURE_TOKEN && sig) {
    if (!verifyCassoSignature(raw, sig, CASSO_SECURE_TOKEN)) {
      return res.status(401).json({ success: false, error: "Invalid signature" });
    }
  } else if (CASSO_SECURE_TOKEN) {
    const token = req.headers["secure-token"] || req.headers["Secure-Token"];
    if (token !== CASSO_SECURE_TOKEN) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return res.status(400).json({ success: false, error: "Invalid JSON" });
  }

  const transactions = extractCassoTransactions(body);
  applyCassoTransactions(transactions);
  res.json({ success: true });
}
