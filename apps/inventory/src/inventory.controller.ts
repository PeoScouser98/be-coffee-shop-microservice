import { AllExceptionsFilter, JwtGuard, ResponseBody, ZodValidationPipe } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import {
	Body,
	Controller,
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
import { InventoryDTO, InventoryValidator } from './dto/inventory.dto'
import { InventoryService } from './inventory.service'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { I18nService } from '@app/i18n'
import { ParseObjectId } from '@app/common/pipes/object-id.pipe'

@Controller('inventories')
export class InventoryController {
	constructor(
		private readonly inventoryService: InventoryService,
		private readonly i18nService: I18nService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(InventoryValidator))
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async createProductInventory(@Body() payload: InventoryDTO, @Res() res: Response) {
		const { data, error } = await this.inventoryService.createProductInventory(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.inventory.created')
		)
		return res.json(responseBody)
	}

	@Get(':productId')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async getProductInventory(
		@Param('productId', new ParseObjectId()) productId: string,
		@Res() res: Response
	) {
		console.log(productId)
		const { data, error } = await this.inventoryService.getProductInventory(productId)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}
}
