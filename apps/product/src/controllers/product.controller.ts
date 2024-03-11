import { ResponseBody } from '@app/common'
import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UsePipes
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as _ from 'lodash'
import { JwtGuard, ZodValidationPipe } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { ProductStatus, ProductTypeEnum } from '../constants/product.constant'
import { ProductDTO, productValidator } from '../dto/product.dto'
import { ProductService } from '../services/product.service'
import { I18nService } from '@app/i18n'
import { ParseObjectId } from '@app/common/pipes/object-id.pipe'

@Controller('products')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly i18nService: I18nService
	) {}

	@Get('published')
	@HttpCode(HttpStatus.OK)
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
		@Req() req: Request,
		@Res() res: Response
	) {
		const filterQuery = _.pick(req.query, ['type', 'status', 'collection', 'productLine'])
		const products = await this.productService.getAllPublisedProducts(filterQuery, {
			page,
			limit
		})
		const responseBody = new ResponseBody(
			products,
			HttpStatus.OK,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}

	@Get('published/:slug')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async getProductBySlug(
		@Query('type') type: string,
		@Param('slug') slug,
		@Res() res: Response
	) {
		const { data, error } = await this.productService.getPublisedProductBySlug({ slug, type })
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}

	@Get('draft')
	@HttpCode(HttpStatus.OK)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.STAFF)
	@UseGuards(JwtGuard)
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
		limit: number,
		@Res() res: Response
	) {
		const { data, error } = await this.productService.getAllDraftProducts({ page, limit })
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UsePipes(new ZodValidationPipe(productValidator))
	@UseFilters(AllExceptionsFilter)
	public async createProduct(@Body() payload: ProductDTO, @Res() res: Response) {
		const { data, error } = await this.productService.createProduct(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.product.created')
		)
		return res.json(responseBody)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseFilters(AllExceptionsFilter)
	public async updateProduct(
		@Param('id') id: string,
		@Res() res: Response,
		@Body() payload,
		@Query('type') type: ProductTypeEnum
	) {
		if (_.isNil(type) || !_.has(ProductTypeEnum, [type]))
			throw new HttpException(
				{
					metadata: null,
					message: 'Invalid query param "type"',
					statusCode: HttpStatus.BAD_REQUEST
				},
				HttpStatus.BAD_REQUEST
			)

		const result = await this.productService.updateProduct(id, type, payload)
		const responseBody = new ResponseBody(
			result,
			HttpStatus.OK,
			this.i18nService.t('success_messages.product.updated')
		)
		return res.json(responseBody)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	public async deleteProduct(@Param('id', new ParseObjectId()) id: string, @Res() res: Response) {
		const { data, error } = await this.productService.deleteProduct(id)
		if (error) throw new HttpException(error, error.errorCode)
		return res.json(data)
	}

	@Patch(':id/publish')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseFilters(AllExceptionsFilter)
	public async publishProductToStore(@Param('id') id: string, @Res() res: Response) {
		const { data, error } = await this.productService.publishProduct(id)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_message.product.published')
		)
		return res.json(responseBody)
	}

	@Get('all-status')
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async getAllProductStatus(@Res() res: Response) {
		const responseBody = new ResponseBody(
			[
				{ label: 'Limited Edition', value: ProductStatus.LIMITED_EDITION },
				{ label: 'Online Only', value: ProductStatus.ONLINE_ONLY },
				{ label: 'Sale Off', value: ProductStatus.SALE_OFF },
				{ label: 'New Arrival', value: ProductStatus.NEW_ARRIVAL }
			],
			HttpStatus.OK,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}
}
