export declare interface IProduct {
	id: string | number;
	product_name: string;
	price: number;
	stock: number;
	attributes: { [key: string]: any };
}
