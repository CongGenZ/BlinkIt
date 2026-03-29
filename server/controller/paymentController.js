import { HttpError } from "../errors/HttpError.js";
import { createPayment, getPaymentById } from "../services/paymentService.js";

export function postCreatePayment(req, res) {
  try {
    const payload = createPayment(req.body?.amount);
    res.status(201).json(payload);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
}

export function getPayment(req, res) {
  const p = getPaymentById(req.params.id);
  if (!p) return res.status(404).json({ error: "Không tìm thấy giao dịch" });
  res.json(p);
}
