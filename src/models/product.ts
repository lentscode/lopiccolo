export interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	availability: string;
	imagesUrls: string[];
	createdAt: Date;
	updatedAt: Date;
	category: Category;
}

export interface Category {
	name?: string;
	description?: string;
}
