import { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import mongoose, { isValidObjectId } from 'mongoose'

export class ParseObjectId implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (!isValidObjectId(value)) throw new Error('Invalid object ID')
		return new mongoose.Types.ObjectId(value)
	}
}
