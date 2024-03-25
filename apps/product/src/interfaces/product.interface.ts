import mongoose from 'mongoose'

import {
	AvailableSneakerStyles,
	AvailableTopHalfSizes,
	ProductGender,
	ProductMaterials,
	ProductStatus,
	ProductTypeEnum
} from '../constants/product.constant'
import { ProductCollectionDocument } from 'apps/product/src/schemas/product-collection.schema'
import { ProductLineDocument } from 'apps/product/src/schemas/product-line.schema'

export declare interface IProduct {
	_id: mongoose.Types.ObjectId | string
	name: string
	description: { vi: string; en: string }
	price: number
	product_type: ProductTypeEnum
	status: ProductStatus
	sku: string
	slug: string
	thumbnail: string
	gallery_images: Array<string>
	attributes?: Record<string, any>
	collection: mongoose.Types.ObjectId | ProductCollectionDocument
	product_line: mongoose.Types.ObjectId | ProductLineDocument
	is_draft: boolean
	is_published: boolean
}

export declare interface ISneakerProduct {
	_id: mongoose.Types.ObjectId
	color_name: string
	color_hex: string
	style: AvailableSneakerStyles
	gender: ProductGender
	materials: [ProductMaterials]
	variants: Array<mongoose.Types.ObjectId>
}

export declare interface ITopHalfProduct {
	_id: mongoose.Types.ObjectId
	color_name: string
	color_hex: string
	sizes: typeof AvailableTopHalfSizes
	material: string
	print_method: string
	gender: ProductGender
	variants: Array<mongoose.Types.ObjectId>
}

export declare interface IAccessoryProduct {
	color_name: string
	color_hex: string
	variants: Array<mongoose.Types.ObjectId>
}
