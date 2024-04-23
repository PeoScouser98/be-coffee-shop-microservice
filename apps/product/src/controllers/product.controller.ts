import { JwtGuard, ZodValidationPipe } from '@app/common'
import { ResponseMessage } from '@app/common/decorators/response-message.decorator'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
import { TransformInterceptor } from '@app/common/interceptors/transform-response.interceptor'
import { ParseObjectIdPipe } from '@app/common/pipes/object-id.pipe'
import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UploadedFile,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes
} from '@nestjs/common'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { Request, Response } from 'express'
import * as _ from 'lodash'
import { z } from 'zod'
import { ProductStatus, ProductTypeEnum } from '../constants/product.constant'
import { ProductDTO, productValidator } from '../dto/product.dto'
import { ProductService } from '../services/product.service'
import { S3Service } from '@app/s3'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('products')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly s3Service: S3Service
	) {}

	@Get('published')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.product.published')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	public async getAllPublishedProducts(
		@Query(
			'page',
			new DefaultValuePipe(1),
			new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
		)
		page: number,
		@Query(
			'limit',
			new DefaultValuePipe(20),
			new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
		)
		limit: number,
		@Req() req: Request
	) {
		const filterQuery = _.pick(req.query, ['type', 'status', 'collection', 'productLine'])
		return await this.productService.getAllPublisedProducts(filterQuery, {
			page,
			limit
		})
	}

	@Get('published/:slug')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	public async getProductBySlug(
		@Query('type', new ZodValidationPipe(z.nativeEnum(ProductTypeEnum))) type: ProductTypeEnum,
		@Param('slug') slug: string
	) {
		return await this.productService.getPublisedProductBySlug({ slug, type })
	}

	@Get('draft')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.STAFF)
	@UseFilters(AllExceptionsFilter)
	public async getAllDraftProducts(
		@Query(
			'page',
			new DefaultValuePipe(1),
			new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
		)
		page: number,
		@Query(
			'limit',
			new DefaultValuePipe(20),
			new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
		)
		limit: number
	) {
		return await this.productService.getAllDraftProducts({ page, limit })
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.product.created')
	@UseInterceptors(TransformInterceptor)
	@UsePipes(new ZodValidationPipe(productValidator))
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async createProduct(@Body() payload: ProductDTO) {
		return await this.productService.createProduct(payload)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.product.updated')
	@UseInterceptors(TransformInterceptor)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async updateProduct(
		@Param('id') id: string,
		@Body() payload,
		@Query('type', new ZodValidationPipe(z.nativeEnum(ProductTypeEnum)))
		type: ProductTypeEnum
	) {
		return await this.productService.updateProduct(id, type, payload)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('success_messages.product.deleted')
	@UseInterceptors(TransformInterceptor)
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async deleteProduct(@Param('id', new ParseObjectIdPipe()) id: string) {
		return await this.productService.deleteProduct(id)
	}

	@Patch(':id/publish')
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.product.published')
	@UseInterceptors(TransformInterceptor)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseFilters(AllExceptionsFilter)
	public async publishProductToStore(@Param('id') id: string, @Res() res: Response) {
		return await this.productService.publishProduct(id)
	}

	@Get('all-status')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	public async getAllProductStatus() {
		return [
			{ label: 'Limited Edition', value: ProductStatus.LIMITED_EDITION },
			{ label: 'Online Only', value: ProductStatus.ONLINE_ONLY },
			{ label: 'Sale Off', value: ProductStatus.SALE_OFF },
			{ label: 'New Arrival', value: ProductStatus.NEW_ARRIVAL }
		]
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	async s3Upload(@UploadedFile() file: Express.Multer.File) {
		return await this.s3Service.uploadFile(file)
	}
}
