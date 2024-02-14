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
import UserRoles from 'apps/user/src/constants/user.constant'
import { Response } from 'express'
import { BranchStoreService } from './branch-store.service'
import { CreateBranchStoreDTO, CreateBranchStoreValidator } from './dto/branch-store.dto'

@Controller('branch-stores')
export class BranchStoreController {
	constructor(
		private readonly branchStoreService: BranchStoreService,
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
	@UsePipes(new ZodValidationPipe(CreateBranchStoreValidator))
	@UseFilters(AllExceptionsFilter)
	public async createBranchStore(@Body() body: CreateBranchStoreDTO, @Res() res: Response) {
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
