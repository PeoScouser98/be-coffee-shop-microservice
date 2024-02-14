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
	ValidationPipe
} from '@nestjs/common'

import { ProductCollectionDTO } from './dto/product-collection.dto'
import { ProductCollectionService } from './product-collection.service'
import { LocalizationService, JwtGuard } from '@app/common'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import UserRoles from 'apps/user/src/constants/user.constant'
import { Roles } from '@app/common/decorators/roles.decorator'

@Controller('product-collections')
export class ProductCollectionController {
	constructor(
		private readonly productCollectionService: ProductCollectionService,
		private readonly localizationService: LocalizationService
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	async getProductCollections(@Res() res) {
		const productCollections = await this.productCollectionService.getProductCollections()
		const responseBody = new ResponseBody(
			productCollections,
			HttpStatus.OK,
			this.localizationService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	async createProductCollection(
		@Body(new ValidationPipe()) payload: ProductCollectionDTO,
		@Res() res
	) {
		const { data, error } = await this.productCollectionService.createProductCollection(payload)
		if (error) throw new HttpException(error, error.errorCode)

		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.localizationService.t('success_messages.product_line.created')
		)
		return res.json(responseBody)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	async updateProductCollection(@Param('id') id, @Body() body, @Res() res) {
		const { data, error } = await this.productCollectionService.updateProductCollection(id, body)
		if (error) throw new HttpException(error, error.errorCode)

		const responseBody = new ResponseBody(
			data,
			HttpStatus.OK,
			this.localizationService.t('success_messages.product_line.updated')
		)
		return res.json(responseBody)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	async deleteProductCollection(@Param('id') id, @Res() res) {
		const { data, error } = await this.productCollectionService.deleteProductCollection(id)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.NO_CONTENT,
			this.localizationService.t('success_messages.product_line.deleted')
		)
		return res.json(responseBody)
	}
}
