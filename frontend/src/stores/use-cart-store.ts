import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock/data";

/**
 * Usage Example:
 * 
 * const { cartItems, voucherCode, isCartOpen, addItem, removeItem, toggleCart, checkout } = useCartStore();
 * or for performance:
 * const cartItems = useCartItems();
 * const isCartOpen = useIsCartOpen();
 */

export interface CartState {
  cartItems: CartItem[];
  voucherCode: string | null;
  discountAmount: number;
  isCartOpen: boolean;
  isLoading: boolean;
  error: string | null;
  orderId: string | null;
  orderNumber: string | null;
  gatewayReference: string | null;
  snapToken: string | null;
}

export interface CartActions {
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setVoucherCode: (code: string | null) => Promise<void>;
  toggleCart: (isOpen?: boolean) => void;
  setOrderDetails: (orderNumber: string, orderId?: string) => void;
  setGatewayReference: (reference: string | null) => void;
  checkout: () => Promise<{ orderId: string; snapToken: string; grandTotal: number }>;
  clearError: () => void;
}

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        cartItems: [],
        voucherCode: null,
        discountAmount: 0,
        isCartOpen: false,
        isLoading: false,
        error: null,
        orderId: null,
        orderNumber: null,
        gatewayReference: null,
        snapToken: null,

        setOrderDetails: (orderNumber, orderId) => {
          set({
            orderNumber,
            ...(orderId ? { orderId } : {}),
          });
        },

        setGatewayReference: (reference) => {
          set({ gatewayReference: reference });
        },

        addItem: (productId, quantity = 1) => {
          const { cartItems } = get();
          const existingItem = cartItems.find((item) => item.productId === productId);

          let updatedItems: CartItem[];
          if (existingItem) {
            updatedItems = cartItems.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Find product details in mock database if available
            const mockProduct = MOCK_PRODUCTS.find((p) => p.id === productId);
            updatedItems = [...cartItems, { productId, quantity, product: mockProduct }];
          }

          set({ cartItems: updatedItems });
        },

        removeItem: (productId) => {
          const { cartItems } = get();
          set({
            cartItems: cartItems.filter((item) => item.productId !== productId),
          });
        },

        updateQuantity: (productId, quantity) => {
          const { cartItems } = get();
          if (quantity <= 0) {
            get().removeItem(productId);
            return;
          }
          set({
            cartItems: cartItems.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          });
        },

        clearCart: () => {
          set({
            cartItems: [],
            voucherCode: null,
            discountAmount: 0,
            orderId: null,
            snapToken: null,
          });
        },

        setVoucherCode: async (code) => {
          set({ isLoading: true, error: null });
          try {
            // TODO: Connect to Laravel API endpoint for voucher verification.
            // Endpoint: POST /api/v1/vouchers/verify or GET /api/v1/vouchers/{code}
            // Target service inside src/services/voucher.ts

            await new Promise((resolve) => setTimeout(resolve, 300));

            if (code === "DISCOUNT50") {
              set({
                voucherCode: code,
                discountAmount: 0.5, // 50% discount
                isLoading: false,
              });
            } else if (code) {
              throw new Error("Invalid voucher code");
            } else {
              set({
                voucherCode: null,
                discountAmount: 0,
                isLoading: false,
              });
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to apply voucher";
            set({
              error: message,
              isLoading: false,
            });
            throw err;
          }
        },

        toggleCart: (isOpen) => {
          set((state) => ({
            isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen,
          }));
        },

        checkout: async () => {
          set({ isLoading: true, error: null });
          try {
            const { cartItems } = get();

            if (cartItems.length === 0) {
              throw new Error("Cart is empty");
            }

            // TODO: Connect to backend API order checkout endpoint.
            // Endpoint: POST /api/v1/orders/checkout
            // Payload: { cart_items: [{ product_id, quantity }], voucher_code }
            // Target service inside src/services/order.ts

            await new Promise((resolve) => setTimeout(resolve, 800));

            // Generate mock order response
            const mockOrderId = `order-uuid-${Math.random().toString(36).substr(2, 9)}`;
            const mockSnapToken = `snap-token-${Math.random().toString(36).substr(2, 9)}`;
            
            // Calculate mock total
            const subtotal = cartItems.reduce((acc, item) => {
              const price = item.product?.price || 100000;
              return acc + price * item.quantity;
            }, 0);
            const grandTotal = subtotal * (1 - get().discountAmount);

            set({
              orderId: mockOrderId,
              snapToken: mockSnapToken,
              isLoading: false,
            });

            return {
              orderId: mockOrderId,
              snapToken: mockSnapToken,
              grandTotal,
            };
          } catch (err) {
            const message = err instanceof Error ? err.message : "Checkout failed";
            set({
              error: message,
              isLoading: false,
            });
            throw err;
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "gamezygo-cart-storage",
        // Persist only cartItems and voucherCode so UI state is transient
        partialize: (state) => ({
          cartItems: state.cartItems,
          voucherCode: state.voucherCode,
          discountAmount: state.discountAmount,
        }),
      }
    ),
    { name: "cart-store" }
  )
);

// Performance-optimized selector hooks
export const useCartItems = () => useCartStore((s) => s.cartItems);
export const useCartCount = () => useCartStore((s) => s.cartItems.reduce((acc, item) => acc + item.quantity, 0));
export const useVoucherCode = () => useCartStore((s) => s.voucherCode);
export const useDiscountAmount = () => useCartStore((s) => s.discountAmount);
export const useIsCartOpen = () => useCartStore((s) => s.isCartOpen);
export const useCartLoading = () => useCartStore((s) => s.isLoading);
export const useCartError = () => useCartStore((s) => s.error);
export const useCheckoutDetails = () =>
  useCartStore((s) => ({ orderId: s.orderId, snapToken: s.snapToken }));
