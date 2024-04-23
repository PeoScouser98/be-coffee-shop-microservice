import { JwtGuard, ZodValidationPipe } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes
} from '@nestjs/common'

import { ResponseMessage } from '@app/common/decorators/response-message.decorator'
import { TransformInterceptor } from '@app/common/interceptors/transform-response.interceptor'
import { ParseObjectIdPipe } from '@app/common/pipes/object-id.pipe'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { Response } from 'express'
import mongoose from 'mongoose'
import { DiscountService } from './discount.service'
import {
	DiscountDTO,
	DiscountValidator,
	PartialDiscountDTO,
	UpdateDiscountValidator
} from './dto/discount.dto'

@Controller('discount')
export class DiscountController {
	constructor(private readonly discountService: DiscountService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	public async getAllDiscountCodes(@Res() res) {
		return this.discountService.getAllDiscountCodes()
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.discount.created')
	@UseInterceptors(TransformInterceptor)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseGuards(JwtGuard)
	@UsePipes(new ZodValidationPipe(DiscountValidator))
	@UseFilters(AllExceptionsFilter)
	public async createDiscountCode(@Body() payload: DiscountDTO, @Res() res: Response) {
		return await this.discountService.createDiscountCode(payload)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.discount.updated')
	@UseInterceptors(TransformInterceptor)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseGuards(JwtGuard)
	@UsePipes(new ZodValidationPipe(UpdateDiscountValidator))
	public async updateDiscountCode(
		@Param('id', new ParseObjectIdPipe()) id: mongoose.Types.ObjectId,
		@Body() payload: PartialDiscountDTO
	) {
		return await this.discountService.updateDiscountCode(id, payload)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('success_messages.discount.deleted')
	@UseInterceptors(TransformInterceptor)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseFilters(AllExceptionsFilter)
	public async deleteDiscountCode(@Param('id') id: string) {
		return await this.discountService.deleteDiscountCode(id)
	}

	@Get('discount-amount/:id')
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async getDiscountAmount() {}
}
