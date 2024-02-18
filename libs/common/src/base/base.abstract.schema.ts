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

@Schema(getDefaultSchemaOptions())
export abstract class BaseAbstractSchema {
	_id: mongoose.Types.ObjectId
}
