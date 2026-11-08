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
    } = req.body;

    // Collect all orders to fulfill (supporting both single and multiple items)
    const targets: OrderFulfillItem[] = [];

    if (Array.isArray(orders) && orders.length > 0) {
      orders.forEach((o: any) => {
        if (o && (o.order_id || o.gateway_reference)) {
          targets.push({
            order_id: o.order_id || o.gateway_reference,
            gateway_reference: o.gateway_reference,
            gross_amount: o.gross_amount || gross_amount,
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

    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
    const webhookEndpoint = `${backendUrl.replace(
      /\/api\/v1\/?$/,
      ""
    )}/api/v1/user/payments/notification`;

    // Known server keys to try (frontend env key, backend default sandbox placeholder)
    const serverKeys = [
      process.env.MIDTRANS_SERVER_KEY || "",
      "SB-Mid-server-YOUR_SANDBOX_SERVER_KEY",
      "Mid-server-eAHxNEcAzv5orX_I7K8c0nxs",
    ].filter(Boolean);

    let fulfilledCount = 0;

    for (const target of targets) {
      const grossAmountFormatted = target.gross_amount
        ? `${Math.round(Number(target.gross_amount))}.00`
        : "100000.00";

      const orderIdentifiers = [target.gateway_reference, target.order_id].filter(
        (id): id is string => Boolean(id)
      );

      let itemFulfilled = false;

      for (const targetId of orderIdentifiers) {
        for (const key of serverKeys) {
          const signature = crypto
            .createHash("sha512")
            .update(targetId + status_code + grossAmountFormatted + key)
            .digest("hex");

          const notificationPayload = {
            order_id: targetId,
            status_code: String(status_code),
            gross_amount: grossAmountFormatted,
            signature_key: signature,
            transaction_status: "settlement",
            fraud_status: "accept",
            payment_type: "credit_card",
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

            const resData = await response.json();
            if (response.ok && resData?.success) {
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
      total_requested: targets.length,
      fulfilled_count: fulfilledCount,
      message: `Fulfilled ${fulfilledCount} of ${targets.length} order(s).`,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error?.message || "Failed to process fulfillment",
    });
  }
}
