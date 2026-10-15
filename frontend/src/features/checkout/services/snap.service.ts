import axios from "axios";
import type {
  CreateSnapTokenPayload,
  CreateSnapTokenResponse,
} from "../types";

/**
 * Request a Snap Token from internal Next.js API route or backend
 */
export async function createSnapToken(
  payload: CreateSnapTokenPayload
): Promise<CreateSnapTokenResponse> {
  const response = await axios.post<{
    status: string;
    data: CreateSnapTokenResponse;
    message?: string;
  }>("/api/midtrans/token", payload);

  if (response.data?.data) {
    return response.data.data;
  }

  throw new Error(response.data?.message || "Failed to generate Snap Token");
}
