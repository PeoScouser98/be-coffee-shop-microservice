import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsPositive,
	IsString,
	Min,
	MinLength,
	Validate
} from 'class-validator'
import mongoose from 'mongoose'
import { ProductStatus, ProductTypeEnum } from '../constants/product.constant'
import { IProduct } from '../interfaces/product.interface'

export class ProductDTO {
	@IsMongoId()
	@IsOptional()
	_id: mongoose.Types.ObjectId

	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	name: string

	@IsObject()
	@Validate((obj) => {
		if (!obj || typeof obj !== 'object') return false
		return 'vi' in obj && 'en' in obj
	})
	description: Record<'vi' | 'en', string>

	@IsString()
	@IsEnum(ProductStatus)
	status: ProductStatus

	@IsString()
	@IsEnum(ProductTypeEnum)
	type: ProductTypeEnum

	@IsNumber()
	@IsPositive()
	price: number

	@IsString({ message: 'SKU phải là 1 chuỗi ký tự' })
	@IsNotEmpty({ message: 'SKU không được bỏ trống' })
	@IsOptional()
	SKU: string

	@IsArray()
	@IsOptional()
	galleryImages: string[]

	@IsString()
	@IsOptional()
	slug: string

	@IsOptional()
	@IsObject()
	attributes: { [key: string]: any }

	@IsBoolean()
	@IsOptional()
	isDraft: boolean

	@IsBoolean()
	@IsOptional()
	isPublished: boolean

	@IsMongoId()
	@IsOptional()
	collection: mongoose.Types.ObjectId

	@IsMongoId()
	@IsOptional()
	productLine: mongoose.Types.ObjectId

	@IsArray()
	@IsOptional()
	variants: Array<mongoose.Types.ObjectId>
}
