import { ResponseBody, ZodValidationPipe } from '@app/common'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UseFilters,
	UsePipes
} from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions'
import { Response } from 'express'
import { UserDTO, UserValidator } from '../dto/user.dto'
import { UserService } from '../services/user.service'
import { I18nService } from '@app/i18n'

@Controller()
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly i18nService: I18nService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(UserValidator))
	@UseFilters(AllExceptionsFilter)
	async registerAccount(@Body() payload: UserDTO, @Res() res: Response) {
		const { data: value, error } = await this.userService.createUser(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new ResponseBody(
			value,
			HttpStatus.CREATED,
			this.i18nService.t('success_messages.user.created')
		)
		return res.json(response)
	}
}
