import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartProduct.model.js";
import AddressModel from "../models/address.model.js";
//import CartProductModel from "../models/cartProduct.model.js";

function getRandomOrderId() {
  return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
export async function createOrderController(request, response) {
  try {
    const userId = request.userId;
    const { addressId, paymentId = "", payment_status = "" } = request.body || {};
    if (!addressId) {
      return response.status(400).json({
        message: "Provide addressId",
        error: true,
        success: false,
      });
    }
    const address = await AddressModel.findOne({ _id: addressId, userId, status: true });
    if (!address) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }
    const cartItems = await CartProductModel.find({ userId }).populate("productId");
    if (!cartItems.length) {
      return response.status(400).json({
        message: "Cart is empty",
        error: true,
        success: false,
      });
    }
    const orderDocs = cartItems.map((item, index) => {
      const product = item.productId || {};
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(product.price) || 0;
      const subTotalAmt = unitPrice * quantity;
      return {
        userId,
        orderId: `${getRandomOrderId()}-${index + 1}`,
        productId: product._id,
        product_details: {
          name: product.name || "",
          image: Array.isArray(product.image) ? product.image : [],
        },
        paymentId,
        payment_status,
        delivery_address: addressId,
        subTotalAmt,
        totalAmt: subTotalAmt,
      };
    });
    const savedOrders = await OrderModel.insertMany(orderDocs);
    await CartProductModel.deleteMany({ userId });
    return response.json({
      message: "Order created",
      data: savedOrders,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId;
    const orderlist = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}