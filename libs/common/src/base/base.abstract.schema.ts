import { Schema, SchemaOptions } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export const defaultSchemaOptions: SchemaOptions = {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		currentTime: () => new Date()
	},
	versionKey: false,
	suppressReservedKeysWarning: false,
	strictQuery: false
	// strictPopulate: false
} as const

@Schema(defaultSchemaOptions)
export class BaseAbstractDocument {
	_id: mongoose.Types.ObjectId
}
