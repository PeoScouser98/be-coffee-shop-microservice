import { JwtGuard, ZodValidationPipe } from '@app/common'
import { ResponseMessage } from '@app/common/decorators/response-message.decorator'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
import { TransformInterceptor } from '@app/common/interceptors/transform-response.interceptor'
import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes
} from '@nestjs/common'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { Request } from 'express'
import { RetailStoreDTO, RetailStoreValidator } from './dto/retail-store.dto'
import { RetailStoreService } from './retail-store.service'

@Controller('retail-stores')
export class RetailStoreController {
	constructor(private readonly retailStoreService: RetailStoreService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	public async findRetailStore(
		@Query('area', new DefaultValuePipe('')) area: string,
		@Query('type', new DefaultValuePipe('')) type: string
	) {
		return await this.retailStoreService.findRetailStore({ area, type })
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.retail_store.created')
	@UseInterceptors(TransformInterceptor)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UsePipes(new ZodValidationPipe(RetailStoreValidator))
	@UseFilters(AllExceptionsFilter)
	public async createRetailStore(@Body() body: RetailStoreDTO) {
		return await this.retailStoreService.createRetailStore(body)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtGuard)
	@UsePipes(new ZodValidationPipe(RetailStoreValidator.partial()))
	@UseFilters(AllExceptionsFilter)
	public async updateRetailStore(@Body() payload: Partial<RetailStoreDTO>, @Req() req: Request) {
		return await this.retailStoreService.updateRetailStore(req.params.id, payload)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.retail_store.deleting')
	@UseInterceptors(TransformInterceptor)
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async deleteRetailStore(@Param('id') id: string) {
		return await this.retailStoreService.deleteRetailStore(id)
	}
}
