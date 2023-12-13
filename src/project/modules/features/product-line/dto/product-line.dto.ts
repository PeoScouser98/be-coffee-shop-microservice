import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import mongoose from 'mongoose'

export class ProductLineDTO {
	@IsMongoId()
	@IsOptional()
	_id: mongoose.Types.ObjectId

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	slug: string
}
