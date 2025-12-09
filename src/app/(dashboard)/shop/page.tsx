"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setProducts(data);
                    } else if (data.products && Array.isArray(data.products)) {
                        setProducts(data.products);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = async (product: Product) => {
        try {
            // Simplified cart structure: product_id and quantity
            const payload = {
                product_id: product.id,
                quantity: 1
            };

            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Added to cart!");
            } else {
                const err = await res.json();
                alert(err.error || "Failed to add to cart");
            }
        } catch (error) {
            console.error("Add to cart error", error);
            alert("Something went wrong");
        }
    };

    if (loading) return <div className="p-8">Loading shop...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Shop Products</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <Card key={product.id} className="overflow-hidden flex flex-col">
                        <div className="aspect-square bg-gray-100 relative">
                            {(product.image || (product.images && product.images.length > 0 && product.images[0].image_url)) ? (
                                <img
                                    src={product.image || product.images![0].image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        <CardHeader className="p-4 pb-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-grow">
                            <div className="mt-2 flex items-center gap-2">
                                <span className="font-bold text-lg">₹{product.selling_price}</span>
                                {product.mrp > product.selling_price && (
                                    <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button className="w-full bg-[#1E88E5] hover:bg-[#1976D2]" onClick={() => addToCart(product)}>
                                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
