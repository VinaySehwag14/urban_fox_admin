export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'Active' | 'Inactive' | 'Draft';
    image: string;
    lastUpdated: string;
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
    id: string;
    customer: string;
    date: string;
    payment: 'Paid' | 'Pending' | 'Failed';
    status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered';
    total: number;
}
