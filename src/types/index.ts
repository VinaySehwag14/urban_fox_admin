export interface Product {
    id: string | number;
    name: string;
    sku?: string;
    qikink_sku?: string | null;
    categories: { id: string; name: string }[];
    category?: string | { name: string };
    selling_price: number;
    mrp: number;
    // sale_price: number; // Deprecated/Mapped? Keeping if used elsewhere, but optional
    stock: number;
    status: 'Active' | 'Inactive' | 'Draft' | boolean; // JSON has is_active boolean
    image?: string;
    images?: { image_url: string; is_primary: boolean; display_order: number }[];
    description?: string;
    lastUpdated?: string;
    variants?: Variant[];
}

export interface Variant {
    id: number;
    product_id: number;
    size?: string;
    color?: string;
    sku_code: string;
    selling_price: number;
    mrp: number;
    stock_quantity: number;
}

export interface Coupon {
    id: string;
    code: string;
    discount: string;
    limit: string;
    expiryDate: string;
    assignedTo: string;
    status: 'Active' | 'Inactive';
}

export interface Order {
    id: number | string;
    user_id: string;
    total_amount: number;
    discount_amount: number;
    final_amount: number;
    status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'success' | 'pending' | 'failed';
    payment_method: string;
    created_at: string;
    updated_at: string;
    transaction_id?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone_number?: string | null;
    };
    shipping_address?: {
        full_name: string;
        street: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
        phone: string;
        email?: string;
    };
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_name: string;
    quantity: number;
    price: number;
    variant_details?: {
        sku: string;
        size: string;
        color: string;
    };
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    displayOrder: number;
}

export interface Banner {
    id?: string;
    title: string;
    sub_text: string;
    image: string;
    link: string;
}
