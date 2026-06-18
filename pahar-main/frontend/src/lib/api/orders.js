import { apiPost } from "@/lib/api/client";

export async function submitOrder(orderPayload) {
  return apiPost("/api/orders", orderPayload, {
    cache: "no-store",
  });
}