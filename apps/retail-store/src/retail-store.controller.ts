import { JwtGuard, ResponseBody, ZodValidationPipe } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import { I18nService } from '@app/i18n'
import {
	BadGatewayException,
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UseFilters,
	UseGuards,
	UsePipes
} from '@nestjs/common'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { Request, Response } from 'express'
import { RetailStoreDTO, RetailStoreValidator } from './dto/retail-store.dto'
import { RetailStoreService } from './retail-store.service'

@Controller('retail-stores')
export class RetailStoreController {
	constructor(
		private readonly retailStoreService: RetailStoreService,
		private readonly i18nService: I18nService
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async findRetailStore(
		@Query('area', new DefaultValuePipe('')) area: string,
		@Query('type', new DefaultValuePipe('')) type: string,
		@Res() res: Response
	) {
		const filterQuery = { area, type }
		const { data, error } = await this.retailStoreService.findRetailStore(filterQuery)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(response)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UsePipes(new ZodValidationPipe(RetailStoreValidator))
	@UseFilters(AllExceptionsFilter)
	public async createRetailStore(@Body() body: RetailStoreDTO, @Res() res: Response) {
		const { data, error } = await this.retailStoreService.createRetailStore(body)
		if (error) {
			throw new HttpException(error, error.errorCode)
		}
		const response = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.retail_store.created')
		)
		return res.json(response)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtGuard)
	@UsePipes(new ZodValidationPipe(RetailStoreValidator.partial()))
	@UseFilters(AllExceptionsFilter)
	public async updateRetailStore(
		@Body() payload: Partial<RetailStoreDTO>,
		@Req() req: Request,
		@Res() res: Response
	) {
		const { data, error } = await this.retailStoreService.updateRetailStore(
			req.params.id,
			payload
		)
		if (error) throw new BadGatewayException(error)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.retail_store.updated')
		)
		return res.json(responseBody)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async deleteRetailStore(@Param('id') id: string, @Res() res: Response) {
		const { data, error } = await this.retailStoreService.deleteRetailStore(id)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_messages.retail_store.deleted')
		)
		return res.json(responseBody)
	}
}
