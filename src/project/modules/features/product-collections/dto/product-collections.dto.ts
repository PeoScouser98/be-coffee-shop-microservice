import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { Types } from 'mongoose'

export class ProductCollectionDTO {
	@IsMongoId()
	@IsOptional()
	_id: Types.ObjectId

	@IsNotEmpty()
	@IsDate()
	@IsOptional()
	releaseDate: Date

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	name: string
}
