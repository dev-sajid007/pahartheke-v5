import StockMovement from "../modules/stock/stockMovement.model.js";

const createStockMovement =
  async ({
    product,
    variantId = null,
    type,
    quantity,
    previousStock,
    newStock,
    note = "",
    referenceId = null,
    createdBy = null,
  }) => {
    await StockMovement.create({
      product,
      variantId,
      type,
      quantity,
      previousStock,
      newStock,
      note,
      referenceId,
      createdBy,
    });
  };

export default createStockMovement;
