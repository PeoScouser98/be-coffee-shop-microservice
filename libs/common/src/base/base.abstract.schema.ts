import { Schema } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export const getDefaultSchemaOptions = () => ({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		currentTime: () => new Date()
	},
	versionKey: false,
	suppressReservedKeysWarning: false,
	strictQuery: false,
	strictPopulate: false
})

@Schema(BaseAbstractSchema.defaultSchemaOptions)
export abstract class BaseAbstractSchema {
	static defaultSchemaOptions = {
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			currentTime: () => new Date()
		},
		versionKey: false,
		suppressReservedKeysWarning: false,
		strictQuery: false,
		strictPopulate: false
	}

	_id: mongoose.Types.ObjectId
}
