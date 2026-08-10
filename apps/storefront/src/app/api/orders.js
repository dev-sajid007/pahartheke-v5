import { apiPost } from "@/lib/api/client";

export async function submitOrder(orderPayload) {
    // replace api/orders with the correct endpoint if needed
  const response = await apiPost("api/orders", orderPayload, {
    cache: "no-store",
  });

  return response;
}