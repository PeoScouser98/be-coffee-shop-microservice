import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Req,
	Res,
	UseFilters
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ShoppingCartService } from './shopping-cart.service'
import { ResponseBody } from '@app/common'
import { I18nService } from '@app/i18n'
import { isValidObjectId } from 'mongoose'
import { ICartItem } from './interfaces/shopping-cart.interface'

@Controller('shopping-cart')
export class ShoppingCartController {
	constructor(
		private readonly shoppingCartService: ShoppingCartService,
		private readonly i18nService: I18nService
	) {}

	@Patch()
	@HttpCode(HttpStatus.CREATED)
	@UseFilters(AllExceptionsFilter)
	public async updateShoppingCart(
		@Req() req: Request,
		@Body() payload: ICartItem,
		@Res() res: Response
	) {
		const credential = req.cookies.client_id ?? req.cookies.SSID
		const { data } = await this.shoppingCartService.updateShoppingCart(credential, payload)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async getShoppingCart(@Req() req: Request, @Res() res: Response) {
		const credential = req.cookies.client_id ?? req.cookies.SSID
		// Get existed cart or create a new one
		const { data: existedCart } = await this.shoppingCartService.getUserShoppingCart(credential)
		if (!existedCart) {
			const user = isValidObjectId(credential) ? credential : null
			const { data } = await this.shoppingCartService.createShoppingCart({
				session_id: req.sessionID,
				user: user
			})
			return res.json(
				new ResponseBody(data, HttpStatus.OK, this.i18nService.t('success_messages.ok'))
			)
		}
		return res.json(
			new ResponseBody(existedCart, HttpStatus.OK, this.i18nService.t('success_messages.ok'))
		)
	}
}
