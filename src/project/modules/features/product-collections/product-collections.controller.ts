import Providers from '@/project/common/constants/provide.constant'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
	ValidationPipe
} from '@nestjs/common'
import { ProductCollectionService } from './product-collection.service'
import CatchException from '@/project/decorators/catch-error.decorator'
import { ProductCollectionDTO } from './dto/product-collections.dto'
import { HttpResponse } from '@/project/common/helpers/http.helper'
import { AuthGuard } from '../auth/guard/auth.guard'
import UserRoles from '../user/constants/user-roles.constant'
import { Roles } from '@/project/decorators/roles.decorator'

@Controller('/product-collections')
export class ProductCollectionController {
	constructor(private readonly productCollectionService: ProductCollectionService) {}

	@Get()
	@CatchException()
	async getProductCollections(@Res() res) {
		const productCollections = await this.productCollectionService.getProductCollections()
		const response = new HttpResponse(productCollections, HttpStatus.OK, {
			vi: 'Ok',
			en: 'Ok'
		})
		return res.status(response.statusCode).json(response)
	}

	@Post()
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async createProductCollection(
		@Body(new ValidationPipe()) payload: ProductCollectionDTO,
		@Res() res
	) {
		const { data, error } = await this.productCollectionService.createProductCollection(payload)
		if (error) throw new HttpException(error, error.errorCode)

		const response = await new HttpResponse(data, HttpStatus.CREATED, {
			vi: 'Thêm bộ sưu tập sản phẩm thành công',
			en: 'Created new product collection'
		})
		return res.status(response.statusCode).json(response)
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async updateProductCollection(@Param('id') id, @Body() body, @Res() res) {
		const { data, error } = await this.productCollectionService.updateProductCollection(id, body)
		if (error) throw new HttpException(error, error.errorCode)

		const response = new HttpResponse(data, HttpStatus.OK, {
			vi: 'Update bộ sưu tập sản phẩm thành công',
			en: 'Updated product collection successfully'
		})
		return res.status(response.statusCode).json(response)
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async deleteProductCollection(@Param('id') id, @Res() res) {
		const { data, error } = await this.productCollectionService.deleteProductCollection(id)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new HttpResponse(data, HttpStatus.NO_CONTENT, {
			vi: 'Đã xóa bộ sưu tập sản phẩm',
			en: 'Deleted product collection'
		})
		return res.status(response.statusCode).json(response)
	}
}
