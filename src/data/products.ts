import pool from "@/config/db";
import { Product } from "@/models/product";

export async function getProducts() {
	const conn = await pool.connect();

	const res = await conn.query("SELECT * FROM get_products()");

	if (!res) {
		throw new Error("products not retrieved");
	}

	const rows: {
		id: string;
		name: string;
		description?: string;
		price: number;
		availability: number;
		images_urls?: string[];
		created_at: Date;
		updated_at: Date;
		category_name?: string;
		category_description?: string;
	}[] = res.rows;

	const products: Product[] = rows.map((e) => ({
		id: parseInt(e.id),
		name: e.name,
		description: e.description,
		price: e.price,
		availability: e.availability,
		imagesUrls: e.images_urls,
		createdAt: e.created_at,
		updatedAt: e.updated_at,
		category: e.category_name
			? {
					name: e.category_name,
					description: e.category_description,
			  }
			: undefined,
	}));

	conn.release();

	return products;
}

export async function getProductById(productId: number) {
	const conn = await pool.connect();

	const res = await conn.query("SELECT * FROM get_product_by_id($1)", [
		productId,
	]);

	if (!res || res.rowCount !== 1) {
		throw new Error("products not retrieved");
	}

	const data: {
		id: string;
		name: string;
		description?: string;
		price: number;
		availability: number;
		images_urls?: string[];
		created_at: Date;
		updated_at: Date;
		category_name?: string;
		category_description?: string;
	} = res.rows[0];

	const product: Product = {
		id: parseInt(data.id),
		name: data.name,
		description: data.description,
		price: data.price,
		availability: data.availability,
		imagesUrls: data.images_urls,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
		category: data.category_name
			? {
					name: data.category_name,
					description: data.category_description,
			  }
			: undefined,
	};

	conn.release();

	return product;
}
