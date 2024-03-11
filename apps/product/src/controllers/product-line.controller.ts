import { ResponseBody } from '@app/common'

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
	UseFilters,
	UseGuards,
	UsePipes
} from '@nestjs/common'
import { Response } from 'express'

import { ProductLineDTO, productLineValidator } from '../dto/product-line.dto'
import { ProductLineService } from '../services/product-line.service'
import { JwtGuard } from '@app/common'
import { ZodValidationPipe } from '@app/common'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import { Roles } from '@app/common/decorators/roles.decorator'
import { I18nService } from '@app/i18n'

@Controller('product-lines')
export class ProductLineController {
	constructor(
		private readonly productLineService: ProductLineService,
		private readonly i18nService: I18nService // private readonly localizationService: I18nService
	) {}
	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	async getProductLines(@Res() res: Response) {
		const { data } = await this.productLineService.getProductLines()
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
	@UsePipes(new ZodValidationPipe(productLineValidator))
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	async createProductLine(@Body() payload: ProductLineDTO, @Res() res: Response) {
		const { data, error } = await this.productLineService.createProductLine(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.product_line.created')
		)
		return res.json(responseBody)
	}
	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	async updateProductLine(
		@Param('id') id: string,
		@Body() payload: ProductLineDTO,
		@Res() res: Response
	) {
		const { data, error } = await this.productLineService.updateProductLine(id, payload)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.product_line.updated')
		)
		return res.json(responseBody)
	}
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	async deleteProductLine(@Param('id') id: string, @Res() res: Response) {
		const { data, error } = await this.productLineService.deleteProductLine(id)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.NO_CONTENT,
			this.i18nService.t('success_messages.product_line.deleted')
		)
		return res.json(responseBody)
	}
}
