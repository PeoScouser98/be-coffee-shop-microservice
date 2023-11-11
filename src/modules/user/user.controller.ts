import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { HttpResponse } from 'src/common/utils/http.utils';
import CatchError from 'src/decorators/catch-error.decorator';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/signup')
	@CatchError()
	async signup(@Body() payload: UserDTO, @Res() res: Response) {
		const { data: value, error } = await this.userService.createUser(payload);
		if (error) return res.status(error.statusCode).json(error);
		const response = new HttpResponse(
			value,
			'Đăng nhập thành công',
			HttpStatus.CREATED
		);
		return res.status(HttpStatus.CREATED).json(response);
	}
}
