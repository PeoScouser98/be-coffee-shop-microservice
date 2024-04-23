import { ZodValidationPipe } from '@app/common'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
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
import { Response } from 'express'
import { UserDTO, UserValidator } from '../dto/user.dto'
import { UserService } from '../services/user.service'

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(UserValidator))
	@UseFilters(AllExceptionsFilter)
	async registerAccount(@Body() payload: UserDTO, @Res() res: Response) {
		return await this.userService.createUser(payload)
	}
}
