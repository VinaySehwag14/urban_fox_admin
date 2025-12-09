"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface CartItem {
    id: string; // Cart Item ID
    product_id: string;
    product: {
        name: string;
        image_url?: string;
        selling_price: number;
    };
    quantity: number;
    total: number;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                // Adjust based on actual API response structure
                // Assuming data.items is the array or data itself is the array
                // For now, let's assume standard response based on previous interactions
                const items = data.items || data || [];
                setCartItems(items);

                // Calculate total if not provided
                const calcTotal = items.reduce((acc: number, item: any) => acc + (item.product?.selling_price * item.quantity || 0), 0);
                setTotal(data.total || calcTotal);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        if (!confirm("Proceed to place order for these items?")) return;

        try {
            // Checkout usually creates an order from the cart
            // We might need to map cart items to the order payload or just call a "checkout" endpoint
            // Based on previous plan, we might need to construct the order payload manually if there isn't a direct "convert cart to order" endpoint.
            // However, typically POST /orders can take items.
            // Let's assume a simple flow: "Buy" means sending the cart items to Create Order.

            const payload = {
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                })),
                payment_method: "COD", // Default for now
                order_type: "Pos" // Or Manual
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Order placed successfully!");
                // Clear cart or refresh (assuming backend clears it or we need to separate call)
                // If backend doesn't auto-clear cart on order, we might need DELETE /api/cart
                setCartItems([]);
                setTotal(0);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to place order");
            }

        } catch (error) {
            console.error("Checkout error", error);
            alert("Checkout failed");
        }
    };

    if (loading) return <div className="p-8">Loading cart...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    {cartItems.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-gray-500">
                                Your cart is empty.
                            </CardContent>
                        </Card>
                    ) : (
                        cartItems.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        {item.product?.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.product?.name || "Product"}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">₹{(item.product?.selling_price * item.quantity).toFixed(2)}</p>
                                        {/* <Button variant="ghost" size="sm" className="text-red-500 h-8 w-8 p-0">
                                            <Trash2 className="w-4 h-4" />
                                          </Button> */}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full bg-[#1E88E5] hover:bg-[#1976D2]"
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                            >
                                Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
