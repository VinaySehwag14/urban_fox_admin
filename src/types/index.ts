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
