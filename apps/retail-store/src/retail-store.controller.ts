import { JwtGuard, LocalizationService, ZodValidationPipe } from '@app/common'
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
	Post,
	Query,
	Res,
	UseFilters,
	UseGuards,
	UsePipes
} from '@nestjs/common'
import { UserRoles } from 'apps/user/src/constants/user.constant'
import { Response } from 'express'
import { RetailStoreService } from './retail-store.service'
import { BranchStoreDTO, RetailChainValidator } from './dto/retail-store.dto'

@Controller('retail-stores')
export class RetailStoreController {
	constructor(
		private readonly branchStoreService: RetailStoreService,
		private readonly localizationService: LocalizationService
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async findBranchStores(
		@Query('name', new DefaultValuePipe('')) city: string,
		@Query('type', new DefaultValuePipe('')) type: string,
		@Res() res: Response
	) {
		const { data, error } = await this.branchStoreService.findBranchStores({
			city,
			type
		})
		if (error) throw new HttpException(error, error.errorCode)
		const response = new ResponseBody(
			data,
			HttpStatus.OK,
			this.localizationService.t('success_message.ok')
		)

		return res.json(response)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UsePipes(new ZodValidationPipe(RetailChainValidator))
	@UseFilters(AllExceptionsFilter)
	public async createBranchStore(@Body() body: BranchStoreDTO, @Res() res: Response) {
		const { data, error } = await this.branchStoreService.createBranchStore(body)
		if (error) {
			throw new HttpException(error, error.errorCode)
		}
		const response = new ResponseBody(
			data,
			HttpStatus.CREATED,
			this.localizationService.t('success_messages.branch_store.created')
		)
		return res.json(response)
	}
}
