import { ResponseMessage } from '@app/common/decorators/response-message.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
import { TransformInterceptor } from '@app/common/interceptors/transform-response.interceptor'
import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Patch,
	Req,
	UseFilters,
	UseInterceptors
} from '@nestjs/common'
import { Request } from 'express'
import { isValidObjectId } from 'mongoose'
import { ICartItem } from './interfaces/shopping-cart.interface'
import { ShoppingCartService } from './shopping-cart.service'

@Controller('shopping-cart')
export class ShoppingCartController {
	constructor(private readonly shoppingCartService: ShoppingCartService) {}

	@Patch()
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.shopping_cart.updated')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	public async updateShoppingCart(@Req() req: Request, @Body() payload: ICartItem) {
		const credential = req.cookies.client_id ?? req.cookies.SSID
		return await this.shoppingCartService.updateShoppingCart(credential, payload)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	public async getShoppingCart(@Headers('X-CLIENT-ID') userId: string, @Req() req: Request) {
		const credential = userId ?? req.cookies.SSID
		// Get existed cart or create a new one
		const existedCart = await this.shoppingCartService.getUserShoppingCart(credential)
		if (!existedCart) {
			const user = isValidObjectId(credential) ? credential : null
			return await this.shoppingCartService.createShoppingCart({
				session_id: req.sessionID,
				user: user
			})
		}
		return existedCart
	}
}
