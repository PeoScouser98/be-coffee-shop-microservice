import { JwtGuard, ZodValidationPipe } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
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
	Post,
	Res,
	UseFilters,
	UseGuards,
	UsePipes
} from '@nestjs/common'

import { Response } from 'express'
import { DiscountService } from './discount.service'
import { DiscountDTO, DiscountValidator } from './dto/discount.dto'
import { I18nService } from '@app/i18n'
import { UserRoles } from 'apps/auth/src/constants/user.constant'

@Controller('discount')
export class DiscountController {
	constructor(
		private readonly discountService: DiscountService,
		private readonly localizationService: I18nService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UsePipes(new ZodValidationPipe(DiscountValidator))
	@UseFilters(AllExceptionsFilter)
	public async createDiscountCode(@Body() payload: DiscountDTO, @Res() res: Response) {
		const { data, error } = await this.discountService.createDiscountCode(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.localizationService.t('success_messages.discount.created')
		)
		return res.json(responseBody)
	}

	@Get('discount-amount/:id')
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async getDiscountAmount() {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async getAllDiscountCodes(@Res() res) {
		const { data, error } = await this.discountService.getAllDiscountCodes()
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(data, HttpStatus.OK, 'Ok')
		return res.json(responseBody)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseFilters(AllExceptionsFilter)
	public async deleteDiscountCode(@Param('id') id: string, @Res() res: Response) {
		const { data, error } = await this.discountService.deleteDiscountCode(id)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.NO_CONTENT,
			this.localizationService.t('success_messages.discount.deleted')
		)
		return res.json(responseBody)
	}
}
