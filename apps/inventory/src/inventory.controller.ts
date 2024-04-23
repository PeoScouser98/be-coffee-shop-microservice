import { AllExceptionsFilter, JwtGuard, ZodValidationPipe } from '@app/common'
import { ResponseMessage } from '@app/common/decorators/response-message.decorator'
import { Roles } from '@app/common/decorators/roles.decorator'
import { TransformInterceptor } from '@app/common/interceptors/transform-response.interceptor'
import { ParseObjectIdPipe } from '@app/common/pipes/object-id.pipe'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes
} from '@nestjs/common'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { InventoryDTO, InventoryValidator } from './dto/inventory.dto'
import { InventoryService } from './inventory.service'

@Controller('inventories')
export class InventoryController {
	constructor(private readonly inventoryService: InventoryService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.inventory.created')
	@UseInterceptors(TransformInterceptor)
	@UsePipes(new ZodValidationPipe(InventoryValidator))
	@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async createProductInventory(@Body() payload: InventoryDTO) {
		return await this.inventoryService.createProductInventory(payload)
	}

	@Get(':productId')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async getProductInventory(
		@Param('productId', new ParseObjectIdPipe()) productId: string
	) {
		return await this.inventoryService.getProductInventory(productId)
	}
}
