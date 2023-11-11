import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseProduct } from './base-product.schema';
import { HydratedDocument } from 'mongoose';

const COLLECTION_NAME = 'prod_desert';

export type DesertProductDocument = HydratedDocument<any>;

@Schema({ collection: COLLECTION_NAME, timestamps: true, versionKey: false })
export class DesertProduct extends BaseProduct {}

export const DesertProductSchema = SchemaFactory.createForClass(DesertProduct);
