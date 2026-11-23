import type { NextApiRequest, NextApiResponse } from "next";

interface SnapItemDetail {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SnapCustomerDetail {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
}

interface RequestBody {
  order_id: string;
  gross_amount: number;
  items?: SnapItemDetail[];
  customer_details?: SnapCustomerDetail;
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

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return res.status(500).json({
      status: "error",
      message: "MIDTRANS_SERVER_KEY is not defined in environment variables.",
    });
  }

  try {
    const {
      order_id,
      gross_amount,
      items,
      customer_details,
    }: RequestBody = req.body;

    if (!order_id || !gross_amount) {
      return res.status(400).json({
        status: "error",
        message: "order_id and gross_amount are required.",
      });
    }

    // Prepare Base64 Authorization
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    // Format item details if provided
    const formattedItems =
      items && items.length > 0
        ? items.map((item) => ({
            id: String(item.id).substring(0, 50),
            price: Math.round(item.price),
            quantity: Math.max(1, item.quantity),
            name: String(item.name).substring(0, 50),
          }))
        : undefined;

    // Check if sum of items matches gross_amount to prevent Midtrans validation error
    const itemsTotal = formattedItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const midtransPayload = {
      transaction_details: {
        order_id: String(order_id),
        gross_amount: Math.round(gross_amount),
      },
      // Only attach item_details if sum matches gross_amount exactly (discounts might cause mismatch)
      item_details:
        itemsTotal === Math.round(gross_amount) ? formattedItems : undefined,
      customer_details: customer_details || {
        first_name: "Customer",
        email: "customer@gamezygo.com",
      },
    };

    const midtransRes = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(midtransPayload),
      }
    );

    const data: any = await midtransRes.json().catch(() => ({}));

    if (!midtransRes.ok) {
      const errorMsg =
        data.error_messages?.[0] ||
        data.message ||
        (data.error === "Unauthorized"
          ? "Midtrans Sandbox 401 (Unauthorized): Kunci Server Key belum aktif atau tidak valid. Silakan verifikasi email pendaftaran Midtrans atau periksa kembali Server Key di dashboard.sandbox.midtrans.com."
          : data.error) ||
        "Gagal meminta Snap token dari Midtrans Sandbox.";

      return res.status(midtransRes.status).json({
        status: "error",
        message: errorMsg,
        details: data,
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        token: data.token,
        redirect_url: data.redirect_url,
      },
    });
  } catch (error: any) {
    console.error("[Midtrans API Error]:", error);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Internal server error occurred.",
    });
  }
}
