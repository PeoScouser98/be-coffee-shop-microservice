import { JwtGuard, ZodValidationPipe } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import { ResponseBody } from '@app/common'
import {
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Patch,
	Post,
	Query,
	Res,
	UseFilters,
	UseGuards,
	UsePipes
} from '@nestjs/common'
import { Response } from 'express'
import { RetailStoreService } from './retail-store.service'
import { BranchStoreDTO, RetailChainValidator } from './dto/retail-store.dto'
import { I18nService } from '@app/i18n'
import { UserRoles } from 'apps/auth/src/constants/user.constant'

@Controller('retail-stores')
export class RetailStoreController {
	constructor(
		private readonly branchStoreService: RetailStoreService,
		private readonly i18nService: I18nService
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async findRetailStore(
		@Query('name', new DefaultValuePipe('')) city: string,
		@Query('type', new DefaultValuePipe('')) type: string,
		@Res() res: Response
	) {
		const { data, error } = await this.branchStoreService.findRetailStore({
			city,
			type
		})
		if (error) throw new HttpException(error, error.errorCode)
		const response = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_message.ok')
		)

		return res.json(response)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UsePipes(new ZodValidationPipe(RetailChainValidator))
	@UseFilters(AllExceptionsFilter)
	public async createRetailStore(@Body() body: BranchStoreDTO, @Res() res: Response) {
		const { data, error } = await this.branchStoreService.createRetailStore(body)
		if (error) {
			throw new HttpException(error, error.errorCode)
		}
		const response = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.retail_store.created')
		)
		return res.json(response)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.CREATED)
	@Roles(UserRoles.ADMIN)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async updateRetailStore() {}
}
