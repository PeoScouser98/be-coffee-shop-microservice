import CatchException from '@/project/decorators/catch-error.decorator'
import { Roles } from '@/project/decorators/roles.decorator'
import { HttpResponse } from '@/project/common/helpers/http.helper'
import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Patch,
	Param,
	Post,
	Res,
	UseGuards,
	ValidationPipe,
	Delete
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '../auth/guard/auth.guard'
import UserRoles from '../user/constants/user-roles.constant'
import { ProductLineDTO } from './dto/product-line.dto'
import { ProductLineService } from './product-line.service'

@Controller('product-lines')
export class ProductLineController {
	constructor(private readonly productLineService: ProductLineService) {}
	@Get()
	@CatchException()
	async getProductLines(@Res() res: Response) {
		const { data } = await this.productLineService.getProductLines()
		const response = new HttpResponse(data, HttpStatus.OK, {
			vi: 'Ok',
			en: 'Ok'
		})
		return res.status(response.statusCode).json(response)
	}
	@Post()
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async createProductLine(
		@Body(new ValidationPipe()) payload: ProductLineDTO,
		@Res() res: Response
	) {
		const { data, error } = await this.productLineService.createProductLine(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new HttpResponse(data, HttpStatus.CREATED, {
			vi: 'Ok',
			en: 'Ok'
		})
		return res.status(response.statusCode).json(response)
	}
	@Patch(':id')
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async updateProductLine(
		@Param('id') id: string,
		@Body() payload: ProductLineDTO,
		@Res() res: Response
	) {
		const { data, error } = await this.productLineService.updateProductLine(id, payload)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new HttpResponse(data, HttpStatus.CREATED, {
			vi: 'Cập nhật dòng sản phẩm thành công',
			en: 'Updated product line successfully!'
		})
		return res.status(response.statusCode).json(response)
	}
	@Delete(':id')
	@UseGuards(AuthGuard)
	@Roles(UserRoles.ADMIN)
	@CatchException()
	async deleteProductLine(@Param('id') id: string, @Res() res: Response) {
		const { data, error } = await this.productLineService.deleteProductLine(id)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new HttpResponse(data, HttpStatus.NO_CONTENT, {
			vi: 'Đã xóa dòng sản phẩm',
			en: 'Deleted product line successfully'
		})
		return res.status(response.statusCode).json(response)
	}
}
