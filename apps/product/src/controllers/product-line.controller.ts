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
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes
} from '@nestjs/common'

import { JwtGuard, ZodValidationPipe } from '@app/common'
import { ResponseMessage } from '@app/common/decorators/response-message.decorator'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
import { TransformInterceptor } from '@app/common/interceptors/transform-response.interceptor'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { ProductLineDTO, productLineValidator } from '../dto/product-line.dto'
import { ProductLineService } from '../services/product-line.service'

@Controller('product-lines')
export class ProductLineController {
	constructor(private readonly productLineService: ProductLineService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	async getProductLines() {
		return await this.productLineService.getProductLines()
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.product_line.created')
	@UseInterceptors(TransformInterceptor)
	@UsePipes(new ZodValidationPipe(productLineValidator))
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	async createProductLine(@Body() payload: ProductLineDTO) {
		return await this.productLineService.createProductLine(payload)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@ResponseMessage('success_messages.product_line.updated')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	async updateProductLine(@Param('id') id: string, @Body() payload: ProductLineDTO) {
		return await this.productLineService.updateProductLine(id, payload)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@Roles(UserRoles.ADMIN)
	@ResponseMessage('success_messages.product_line.deleted')
	@UseInterceptors(TransformInterceptor)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	async deleteProductLine(@Param('id') id: string) {
		return await this.productLineService.deleteProductLine(id)
	}
}
