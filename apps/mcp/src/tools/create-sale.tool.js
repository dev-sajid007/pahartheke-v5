import { SaleService } from "../services/sale.service.js";

export const createSaleTool = {
  name: "create_sale",
  description: "Create a new sale (order) in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      customer: { type: "string", description: "Customer MongoDB ObjectId (optional)" },
      items: {
        type: "array",
        description: "Products sold",
        items: {
          type: "object",
          properties: {
            product: { type: "string", description: "Product MongoDB ObjectId" },
            variantId: { type: "string" },
            variantName: { type: "string" },
            quantity: { type: "number" },
            salePrice: { type: "number" },
            subtotal: { type: "number" },
            cost: { type: "number" },
            profit: { type: "number" },
          },
          required: ["product", "quantity", "salePrice"],
        },
      },
      subtotal: { type: "number", description: "Subtotal before discount" },
      shippingCost: { type: "number", default: 0 },
      discount: { type: "number", default: 0 },
      badgeName: { type: "string" },
      badgeDiscount: { type: "number", default: 0 },
      grandTotal: { type: "number", description: "Final total" },
      paidAmount: { type: "number", default: 0 },
      source: { type: "string", enum: ["pos", "website"], default: "pos" },
      note: { type: "string" },
      soldBy: { type: "string", description: "User MongoDB ObjectId" },
      order_date: { type: "string", description: "Order date (ISO string, default: now)" },
    },
    required: ["items", "subtotal", "grandTotal"],
  },
  handler: async (args) => {
    try {
      const sale = await SaleService.create(args);
      return { content: [{ type: "text", text: `Sale created! Invoice: ${sale.invoiceNo} | Total: ৳${sale.grandTotal} | Due: ৳${sale.dueAmount}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
