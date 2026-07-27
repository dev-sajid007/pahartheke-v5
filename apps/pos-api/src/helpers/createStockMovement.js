import StockMovement from "../modules/stock/stockMovement.model.js";

const createStockMovement = async (params) => {
  const required = ['product', 'type', 'quantity', 'previousStock', 'newStock'];
  for (const field of required) {
    if (params[field] === undefined || params[field] === null) {
      throw new Error(`createStockMovement: missing required field "${field}"`);
    }
  }

  await StockMovement.create({
    product: params.product,
    variantId: params.variantId || null,
    type: params.type,
    quantity: params.quantity,
    previousStock: params.previousStock,
    newStock: params.newStock,
    note: params.note || "",
    referenceId: params.referenceId || null,
    createdBy: params.createdBy || null,
  });
};

export default createStockMovement;
