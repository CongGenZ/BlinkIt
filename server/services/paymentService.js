import crypto from "crypto";
import { HttpError } from "../errors/HttpError.js";

const BANK_ID = process.env.VIETQR_BANK_ID || "";
const ACCOUNT_NUMBER = process.env.VIETQR_ACCOUNT_NUMBER || "";
const ACCOUNT_NAME = process.env.VIETQR_ACCOUNT_NAME || "";
const QR_TEMPLATE = process.env.VIETQR_TEMPLATE || "compact2";

/** @type {Map<string, { id: string, amount: number, transferContent: string, status: string, createdAt: string, paidAt?: string, cassoRef?: string }>} */
const payments = new Map();

function randomId() {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

function buildVietQrImageUrl(amount, addInfo) {
  const base = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NUMBER}-${QR_TEMPLATE}.png`;
  const params = new URLSearchParams({
    amount: String(Math.round(amount)),
    addInfo,
    accountName: ACCOUNT_NAME,
  });
  return `${base}?${params.toString()}`;
}

/**
 * Gỡ bỏ dấu tiếng Việt để so khớp nội dung CK từ ngân hàng (thường không dấu).
 */
function normalizeText(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toUpperCase()
    .replace(/\s+/g, "");
}

function findPaymentByTransferContent(description) {
  const norm = normalizeText(description);
  for (const p of payments.values()) {
    if (p.status !== "pending") continue;
    const code = normalizeText(p.transferContent);
    if (norm.includes(code)) return p;
  }
  return null;
}

/**
 * @param {unknown} amountInput
 */
export function createPayment(amountInput) {
  if (!BANK_ID || !ACCOUNT_NUMBER || !ACCOUNT_NAME) {
    throw new HttpError(
      503,
      "Chưa cấu hình VietQR. Đặt VIETQR_BANK_ID, VIETQR_ACCOUNT_NUMBER, VIETQR_ACCOUNT_NAME trong .env"
    );
  }

  const amount = Number(amountInput);
  if (!Number.isFinite(amount) || amount < 1000) {
    throw new HttpError(400, "Số tiền tối thiểu 1000 VND");
  }

  const id = randomId();
  const transferContent = `PAY${id}`;
  const rounded = Math.round(amount);
  const qrImageUrl = buildVietQrImageUrl(rounded, transferContent);

  const record = {
    id,
    amount: rounded,
    transferContent,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  payments.set(id, record);

  return {
    ...record,
    qrImageUrl,
    bankId: BANK_ID,
    accountNumber: ACCOUNT_NUMBER,
    accountName: ACCOUNT_NAME,
  };
}

/**
 * @param {string} id
 */
export function getPaymentById(id) {
  return payments.get(id) ?? null;
}

/**
 * Trích danh sách giao dịch từ body webhook Casso.
 * @param {Record<string, unknown>} webhookBody
 */
export function extractCassoTransactions(webhookBody) {
  const list = [];
  if (!webhookBody || typeof webhookBody !== "object") return list;
  const data = webhookBody.data;
  if (Array.isArray(data)) {
    for (const row of data) {
      if (row && typeof row === "object") list.push(row);
    }
  } else if (data && typeof data === "object") {
    list.push(data);
  }
  return list;
}

/**
 * Cập nhật trạng thái đơn theo giao dịch Casso (đã parse).
 * @param {Array<Record<string, unknown>>} transactions
 */
export function applyCassoTransactions(transactions) {
  for (const tx of transactions) {
    const description = String(
      tx.description ??
        tx.remark ??
        tx.content ??
        tx.addInfo ??
        tx.note ??
        ""
    );
    const amount = Number(tx.amount ?? tx.transferAmount ?? 0);
    const payment = findPaymentByTransferContent(description);
    if (!payment) continue;
    const amtOk = !amount || amount === payment.amount || Math.abs(amount - payment.amount) < 1;
    if (!amtOk) continue;
    payment.status = "paid";
    payment.paidAt = new Date().toISOString();
    payment.cassoRef = String(tx.id ?? tx.ref ?? tx.reference ?? "");
  }
}
