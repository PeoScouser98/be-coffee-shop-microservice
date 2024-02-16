import { LocalizationService, ResponseBody, ZodValidationPipe } from '@app/common'
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

@Controller()
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly localizationService: LocalizationService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(UserValidator))
	@UseFilters(AllExceptionsFilter)
	async signup(@Body() payload: UserDTO, @Res() res: Response) {
		const { data: value, error } = await this.userService.createUser(payload)
		if (error) throw new HttpException(error, error.errorCode)
		const response = new ResponseBody(
			value,
			HttpStatus.CREATED,
			this.localizationService.t('success_messages.user.created')
		)
		return res.json(response)
	}
}
