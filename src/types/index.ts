export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "waffle" | "cafe" | "both" | "ADMIN" | "USER" | "BOTH";
    shopName?: string;
}

export interface StockItem {
    _id: string;
    name: string;
    quantity: number;
    unit: string;
    // Allow broader shopType values
    shopType: "Waffle" | "Cafe" | "Both" | string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    // Allow broader shopType values
    shopType: "Waffle" | "Cafe" | "Both" | string;
    createdAt: string;
    updatedAt: string;
}

export interface BillItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Bill {
    _id: string;
    billNumber: string;
    shopType: "Waffle" | "Cafe" | "Both" | "WAFFLE" | "CAFE" | "BOTH";
    branch?: string;
    items: BillItem[];
    subtotal: number;
    tax: number;
    total: number;
    // Optional alias fields for compatibility
    totalAmount?: number;
    customerName?: string;
    createdBy: User;
    createdAt: string;
}

export interface StockUpdateItem {
    stockId: string;
    stockName: string;
    openingStock: number;
    closingStock: number;
    damagedStock: number;
    unit: string;
}

export interface StockUpdate {
    _id: string;
    date: string;
    shopType: "Waffle" | "Cafe" | "Both" | "WAFFLE" | "CAFE" | "BOTH" | string;
    branch?: string;
    // Single item update fields
    stockItemId?: any; // Can be string or populated object
    type?: "Opening Stock" | "Closing Stock" | "Damaged Stock" | string;
    quantity?: number;
    // Bulk update fields
    stockItems?: StockUpdateItem[];
    createdBy: User;
    createdAt: string;
}

export interface RevenueReport {
    _id: {
        shopType: string;
        branch?: string;
        date: string;
    };
    totalRevenue: number;
    totalBills: number;
    averageBillValue: number;
}