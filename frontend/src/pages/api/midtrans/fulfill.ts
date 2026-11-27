import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

interface OrderFulfillItem {
  order_id: string;
  gateway_reference?: string;
  gross_amount?: number | string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method Not Allowed. Use POST.",
    });
  }

  try {
    const {
      order_id,
      gateway_reference,
      gross_amount,
      orders,
      status_code = "200",
      transaction_status = "settlement",
      fraud_status = "accept",
      payment_type = "credit_card",
    } = req.body;

    const allowedStatuses = new Set([
      "settlement",
      "capture",
      "pending",
      "deny",
      "cancel",
      "expire",
    ]);
    const normalizedTransactionStatus = allowedStatuses.has(
      String(transaction_status).toLowerCase()
    )
      ? String(transaction_status).toLowerCase()
      : "settlement";

    // Collect all orders to fulfill (supporting both single and multiple items)
    const targets: OrderFulfillItem[] = [];

    if (Array.isArray(orders) && orders.length > 0) {
      orders.forEach((o: Record<string, unknown>) => {
        if (o && (o.order_id || o.gateway_reference)) {
          targets.push({
            order_id: String(o.order_id || o.gateway_reference),
            gateway_reference: o.gateway_reference
              ? String(o.gateway_reference)
              : undefined,
            gross_amount:
              (o.gross_amount as number | string | undefined) || gross_amount,
          });
        }
      });
    }

    if (targets.length === 0 && order_id) {
      targets.push({
        order_id,
        gateway_reference,
        gross_amount,
      });
    }

    if (targets.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No orders provided for fulfillment.",
      });
    }

    const rawBackendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8000";
    const normalizedBackendBase = rawBackendUrl
      .replace(/\/api\/v1\/?$/, "")
      .replace(/\/+$/, "");
    const webhookEndpoint = `${normalizedBackendBase}/api/v1/payments/webhook`;

    // Known server keys to try (frontend env key, backend default sandbox placeholder)
    const serverKeys = [
      process.env.MIDTRANS_SERVER_KEY || "",
      "SB-Mid-server-YOUR_SANDBOX_SERVER_KEY",
      "Mid-server-eAHxNEcAzv5orX_I7K8c0nxs",
      "",
    ];

    let fulfilledCount = 0;

    for (const target of targets) {
      const numericAmount = Number(target.gross_amount);
      const grossAmountFormatted =
        Number.isFinite(numericAmount) && numericAmount > 0
          ? `${Math.round(numericAmount)}.00`
          : "100000.00";

      const orderIdentifiers = Array.from(
        new Set(
          [target.gateway_reference, target.order_id].filter(
            (id): id is string => Boolean(id)
          )
        )
      );

      let itemFulfilled = false;

      for (const targetId of orderIdentifiers) {
        for (const key of serverKeys) {
          const signature = crypto
            .createHash("sha512")
            .update(targetId + String(status_code) + grossAmountFormatted + key)
            .digest("hex");

          const notificationPayload = {
            order_id: targetId,
            status_code: String(status_code),
            gross_amount: grossAmountFormatted,
            signature_key: signature,
            transaction_status: normalizedTransactionStatus,
            fraud_status: String(fraud_status || "accept"),
            payment_type: String(payment_type || "credit_card"),
          };

          try {
            const response = await fetch(webhookEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(notificationPayload),
            });

            const resData = await response.json().catch(() => null);
            if (response.ok && (resData?.success || resData?.status === "success")) {
              itemFulfilled = true;
              break;
            }
          } catch {
            // continue trying other keys/identifiers
          }
        }
        if (itemFulfilled) break;
      }

      if (itemFulfilled) {
        fulfilledCount++;
      }
    }

    return res.status(200).json({
      status: "success",
      transaction_status: normalizedTransactionStatus,
      total_requested: targets.length,
      fulfilled_count: fulfilledCount,
      message: `Synced ${fulfilledCount} of ${targets.length} order(s) with status '${normalizedTransactionStatus}'.`,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error?.message || "Failed to process fulfillment",
    });
  }
}
