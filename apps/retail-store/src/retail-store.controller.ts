import { JwtGuard, ZodValidationPipe } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import { ResponseBody } from '@app/common'
import {
	BadGatewayException,
	Body,
	Controller,
	DefaultValuePipe,
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
import { Request, Response } from 'express'
import { RetailStoreService } from './retail-store.service'
import { RetailStoreDTO, RetailStoreValidator } from './dto/retail-store.dto'
import { I18nService } from '@app/i18n'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { z } from 'zod'

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
		@Query('name', new DefaultValuePipe('')) city: string,
		@Query('type', new DefaultValuePipe('')) type: string,
		@Res() res: Response
	) {
		const { data, error } = await this.retailStoreService.findRetailStore({ city, type })
		if (error) throw new HttpException(error, error.errorCode)
		const response = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_message.ok')
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
}
