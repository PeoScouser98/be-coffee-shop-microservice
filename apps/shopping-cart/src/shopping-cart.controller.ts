import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	Session,
	UseFilters
} from '@nestjs/common'
import { Response } from 'express'

@Controller('shopping-cart')
export class ShoppingCartController {
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseFilters(AllExceptionsFilter)
	public async createShoppingCart(
		@CurrentUser() user,
		@Session() session,
		@Body() payload,
		@Res() res: Response
	) {
		return res.json(session)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async getShoppingCart(@Session() session, @Res() res: Response) {
		return res.json(session.id)
	}
}
