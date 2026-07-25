import PDFDocument from "pdfkit";

import fs from "fs";

import path from "path";

import bwipjs from "bwip-js";

import Sale from "../sale/sale.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../core/ApiError.js";

export const generateInvoicePDF =
  asyncHandler(async (req, res) => {
    const sale = await Sale.findById(
      req.params.id
    )
      .populate("items.product")
      .populate("customer")
      .populate("soldBy", "name");

    if (!sale) {
      throw new ApiError(
        404,
        "Sale not found"
      );
    }

    const invoicePath = path.join(
      "invoices",
      `${sale.invoiceNo}.pdf`
    );

    const doc = new PDFDocument({
      margin: 30,
    });

    const stream = fs.createWriteStream(
      invoicePath
    );

    doc.pipe(stream);

    // Header
    doc
      .fontSize(22)
      .text("PAHAR POS", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Invoice: ${sale.invoiceNo}`);

    doc.text(
      `Date: ${(sale.order_date || sale.createdAt).toDateString()}`
    );

    if (sale.customer) {
      doc.text(
        `Customer: ${sale.customer.name}`
      );

      doc.text(
        `Phone: ${sale.customer.phone}`
      );

      if (sale.customer.address) {
        doc.text(
          `Address: ${sale.customer.address}`
        );
      }
    }

    doc.moveDown();

    // Table Header
    doc.text(
      "--------------------------------------------------"
    );

    doc.text(
      "Product | Qty | Price | Disc | Total"
    );

    doc.text(
      "--------------------------------------------------"
    );

    // Items
    sale.items.forEach((item) => {
      const baseTotal = item.quantity * item.salePrice;
      let discAmount = 0;
      if (item.itemDiscountType === "Percentage") {
        discAmount = baseTotal * (item.itemDiscount || 0) / 100;
      } else if (item.itemDiscountType === "Fixed") {
        discAmount = item.itemDiscount || 0;
      }
      const lineTotal = baseTotal - discAmount;
      doc.text(
        `${item.product.name} | ${item.quantity} | ${item.salePrice} | ${discAmount > 0 ? discAmount : '-'} | ${lineTotal}`
      );
    });

    doc.moveDown();

    doc.text(
      "--------------------------------------------------"
    );

    doc.text(
      `Subtotal: ${sale.subtotal} BDT`
    );

    doc.text(
      `Discount: ${sale.discount} BDT`
    );

    doc.text(
      `Grand Total: ${sale.grandTotal} BDT`
    );

    doc.text(
      `Paid: ${sale.paidAmount} BDT`
    );

    doc.text(
      `Due: ${sale.dueAmount} BDT`
    );

    doc.text(
      `Profit: ${sale.totalProfit} BDT`
    );

    doc.moveDown();

    // Barcode
    const barcodeBuffer =
      await bwipjs.toBuffer({
        bcid: "code128",

        text: sale.invoiceNo,

        scale: 3,

        height: 10,
      });

    doc.image(barcodeBuffer, {
      fit: [200, 80],
      align: "center",
    });

    doc.moveDown();

    doc.text(
      `Served By: ${sale.soldBy?.name || "N/A"}`
    );

    if (sale.note) {
      doc.moveDown();

      doc.text(`Note: ${sale.note}`, {
        align: "left",
      });
    }

    doc.moveDown();

    doc.text(
      "Thank You For Your Purchase",
      {
        align: "center",
      }
    );

    doc.end();

    stream.on("finish", () => {
      res.download(invoicePath);
    });
  });
