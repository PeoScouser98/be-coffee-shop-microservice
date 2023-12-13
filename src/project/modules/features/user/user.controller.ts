import { Body, Controller, HttpStatus, Post, Res, Req } from '@nestjs/common'
import { Request, Response } from 'express'
import { UserDTO } from './dto/user.dto'
import { UserService } from './user.service'
import { HttpException } from '@nestjs/common/exceptions'
import CatchException from '@/project/decorators/catch-error.decorator'
import { HttpResponse } from '@/project/common/helpers/http.helper'

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/signup')
	@CatchException()
	async signup(@Body() payload: UserDTO, @Req() req: Request, @Res() res: Response) {
		const { data: value, error } = await this.userService.createUser(payload)
		if (error) throw new HttpException(error.message[req.headers.locale as any], error.errorCode)
		const response = new HttpResponse(value, HttpStatus.CREATED, {
			vi: 'Đăng ký thành công',
			en: 'Registered successfully'
		})
		return res.status(HttpStatus.CREATED).json(response)
	}
}
