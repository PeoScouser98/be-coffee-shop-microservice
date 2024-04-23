import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectS3 } from 'nestjs-s3'

@Injectable()
export class S3Service {
	constructor(
		@InjectS3() private readonly s3: S3Client,
		private readonly configService: ConfigService
	) {}

	async uploadFile(file: Express.Multer.File) {
		const result = await this.s3.send(
			new PutObjectCommand({
				Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
				Key: file.originalname,
				Body: file.buffer,
				ContentType: 'image/png'
			})
		)

		const url = await getSignedUrl(
			this.s3,
			new GetObjectCommand({
				Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
				Key: file.originalname
			})
		)

		return { ...result.$metadata, url }
	}
}
