import {
	AllExceptionsFilter,
	JwtGuard,
	LocalizationService,
	ResponseBody,
	ZodValidationPipe
} from '@app/common'
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
import UserRoles from 'apps/user/src/constants/user.constant'
import { Response } from 'express'
import { InventoryDTO, InventoryValidator } from './dto/inventory.dto'
import { InventoryService } from './inventory.service'

@Controller('inventories')
export class InventoryController {
	constructor(
		private readonly inventoryService: InventoryService,
		private readonly localizationService: LocalizationService
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
			this.localizationService.t('success_messages.inventory.created')
		)
		return res.json(responseBody)
	}

	@Get(':productId')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async getProductInventory(@Param('productId') productId: string, @Res() res: Response) {
		const { data, error } = await this.inventoryService.getProductInventory(productId)
		if (error) throw new HttpException(error, error.errorCode)
		const responseBody = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.localizationService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}
}
