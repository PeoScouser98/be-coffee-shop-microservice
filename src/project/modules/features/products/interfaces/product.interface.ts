import mongoose, { ObjectId, Types } from 'mongoose'
import {
	AvailableSneakerSizes,
	AvailableSneakerStyles,
	AvailableTopHalfSizes,
	ProductGender,
	ProductStatus,
	ProductTypeEnum
} from '../constants/product.constant'
import { IProductCollection } from '../../product-collections/interfaces/product-collection.interface'
import { ProductCollectionDocument } from '../../product-collections/schemas/product-collection.schema'

export declare interface IProduct {
	_id: mongoose.Types.ObjectId
	name: string
	description: { vi: string; en: string }
	price: number
	type: ProductTypeEnum
	status: ProductStatus
	SKU: string
	slug: string
	galleryImages: Array<string>
	attributes: Record<string, any>
	collection: mongoose.Types.ObjectId | ProductCollectionDocument
	variants: Array<mongoose.Types.ObjectId>
	isDraft: boolean
	isPublished: boolean
}

export declare interface ISneakerProduct {
	_id: mongoose.Types.ObjectId
	color: Record<'label' | 'value', string>
	style: AvailableSneakerStyles
	gender: ProductGender
	collection: mongoose.Types.ObjectId | IProductCollection
}

export declare interface ITopHalfProduct {
	_id: mongoose.Types.ObjectId
	color: Record<'label' | 'value', string>
	sizes: typeof AvailableTopHalfSizes
	material: string
	printMethod: string
	gender: ProductGender
}

export declare interface IAccessoriesProduct {}
