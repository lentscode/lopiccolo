import { Category } from "./product";

export interface Order {
	id: number;
	orderDate: Date;
	status: string;
	total: number;
}

export interface OrderItem {
	id: number;
	name: number;
	description: string;
	price: number;
	availability: number;
	imagesUrls: string[];
	createdAt: Date;
	updatedAt: Date;
	category: Category;
	quantity: number;
}
