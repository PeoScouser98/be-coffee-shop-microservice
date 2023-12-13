import { HttpResponse } from '@/project/common/helpers/http.helper'
import { Roles } from '@/project/decorators/roles.decorator'
import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
	ValidationPipe
} from '@nestjs/common'
import { Request, Response } from 'express'
import _ from 'lodash'
import CatchException from 'src/project/decorators/catch-error.decorator'
import { AuthGuard } from '../auth/guard/auth.guard'
import UserRoles from '../user/constants/user-roles.constant'
import { ProductDTO } from './dto/product.dto'
import { ProductFactoryService } from './product.factory.service'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(
		private readonly productFactoryService: ProductFactoryService,
		private readonly productService: ProductService
	) {}

	@Get()
	@CatchException()
	async getProducts(@Req() req, @Res() res: Response) {
		const DEFAULT_PAGE_INDEX = 1 as const
		const DEFAULT_PAGE_SIZE = 20 as const
		const VALID_QUERY_KEYS = [
			'page',
			'limit',
			'type',
			'status',
			'collection',
			'productLine'
		] as const

		const { page, limit, ...queries } = _.pick(req.query, VALID_QUERY_KEYS)

		// Get pagination options
		const pageIndex: number = Boolean(page) ? +page : DEFAULT_PAGE_INDEX
		const pageSize: number = Boolean(limit) ? +limit : DEFAULT_PAGE_SIZE

		const products = await this.productService.getProducts(queries, {
			page: pageIndex,
			limit: pageSize
		})
		const response = new HttpResponse(products, HttpStatus.OK, {
			vi: 'Ok',
			en: 'Ok'
		})
		return res.status(HttpStatus.OK).json(response)
	}

	@Get(':slug')
	@CatchException()
	async getProductBySlug(@Param('slug') slug, @Res() res: Response) {
		const { data, error } = await this.productService.getProductBySlug(slug)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new HttpResponse(data, HttpStatus.OK, { vi: 'Ok', en: 'Ok' })
		return res.status(response.statusCode).json(response)
	}

	@Post()
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async createProduct(@Body(new ValidationPipe()) payload: ProductDTO, @Res() res: Response) {
		const { data, error } = await this.productFactoryService.createProduct(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new HttpResponse(data, HttpStatus.CREATED, {
			vi: 'Thêm sản phẩm thành công',
			en: 'Created product sucessfully'
		})
		return res.status(response.statusCode).json(response)
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async updateProduct(
		@Req() req: Request,
		@Res() res: Response,
		@Body(new ValidationPipe()) payload: ProductDTO
	) {
		const result = await this.productFactoryService.updateProduct(req.params.id, payload)
		const response = new HttpResponse(result, HttpStatus.OK, {
			vi: 'Cập nhật sản phẩm thành công',
			en: 'Updated product successfully'
		})
		return res.status(HttpStatus.CREATED).json(response)
	}
}
