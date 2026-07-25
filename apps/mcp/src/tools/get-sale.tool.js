import { SaleService } from "../services/sale.service.js";
export const getSaleTool = {
  name: "get_sale",
  description: "Get a single sale by ID or invoice number",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Sale MongoDB ObjectId" },
      invoiceNo: { type: "string", description: "Invoice number" },
    },
  },
  handler: async (args) => {
    try {
      const sale = args.id ? await SaleService.getById(args.id) : await SaleService.getByInvoice(args.invoiceNo);
      if (!sale) return { content: [{ type: "text", text: "Sale not found" }] };
      const items = sale.items.map(i => `  - ${i.variantName || i.product?.name}: ${i.quantity} x ৳${i.salePrice} = ৳${i.subtotal}`).join("\n");
      const customerName = sale.customer?.name || "Walk-in";
      return { content: [{ type: "text", text: `🧾 Invoice: ${sale.invoiceNo}\nCustomer: ${customerName}\nDate: ${new Date(sale.order_date || sale.createdAt).toLocaleString()}\n\nItems:\n${items}\n\nSubtotal: ৳${sale.subtotal}\nDiscount: ৳${sale.discount}\nShipping: ৳${sale.shippingCost}\nGrand Total: ৳${sale.grandTotal}\nPaid: ৳${sale.paidAmount}\nDue: ৳${sale.dueAmount}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
