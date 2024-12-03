export interface Product {
	id: number;
	name: string;
	description?: string;
	price: number;
	availability: number;
	imagesUrls?: string[];
	createdAt: Date;
	updatedAt: Date;
	category?: Category;
}

export interface Category {
	name?: string;
	description?: string;
}
