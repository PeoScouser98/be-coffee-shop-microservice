export enum ProductTypeEnum {
	SNEAKER = 'sneakers',
	TOP_HALF = 'top-half',
	ACCESSORY = 'accessory'
}

export const AvailableSneakerSizes = [
	'35',
	'36',
	'36.5',
	'37',
	'38',
	'38.5',
	'39',
	'40',
	'40.5',
	'41',
	'42',
	'42.5',
	'43',
	'44',
	'44.5',
	'45',
	'46'
] as const

export const AvailableTopHalfSizes = ['S', 'M', 'L', 'XL'] as const

export enum AvailableSneakerStyles {
	LOW_TOP = 'Low top',
	MID_TOP = 'Mid top',
	HIGH_TOP = 'High top',
	MULE = 'Mule'
}

export enum ProductStatus {
	COMMON = 'common',
	LIMITED_EDITION = 'limited-edition',
	ONLINE_ONLY = 'online-only',
	SALE_OFF = 'sale-off',
	NEW_ARRIVAL = 'new-arraval',
	SUSPENSED_BUSINESS = 'suspensed-business'
}

export enum ProductGender {
	MEN = 'men',
	WOMEN = 'women',
	UNISEX = 'unisex'
}

export enum ProductMaterials {
	CANVAS = 'Canvas',
	SUEDE = 'Suede',
	COTTON = 'Cotton',
	KNIT = 'Knit',
	RIPSTOP = 'Ripstop',
	SINGLE_JERSEY = 'Single Jersey',
	FLANNEL = 'Flannel',
	ACRYLIC = 'Acrylic',
	CORDUROY = 'Corduroy',
	POLYESTER = 'Polyester'
}
