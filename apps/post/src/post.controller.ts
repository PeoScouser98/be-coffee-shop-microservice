import {
	Controller,
	DefaultValuePipe,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	ParseArrayPipe,
	ParseIntPipe,
	Query,
	Res,
	UseFilters,
	UseGuards
} from '@nestjs/common'
import { PostService } from './post.service'
import { AllExceptionsFilter, JwtGuard, ResponseBody, Roles } from '@app/common'
import { Response } from 'express'
import { I18nService } from '@app/i18n'
import { UserRoles } from 'apps/auth/src/constants/user.constant'

@Controller()
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly i18nService: I18nService
	) {}

	@Get('draft')
	@UseGuards(JwtGuard)
	@Roles(UserRoles.ADMIN)
	@UseFilters(AllExceptionsFilter)
	public async getAllDraftPosts(@Res() res: Response) {
		const { data, error } = await this.postService.getAllDraftPosts()
		if (error) throw new HttpException(error, error.errorCode)

		const responseBody = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_messages.ok')
		)

		return res.json(responseBody)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	public async getPublishedPosts(
		@Query('page', new ParseIntPipe(), new DefaultValuePipe(1)) page: number,
		@Query('limit', new ParseIntPipe(), new DefaultValuePipe(20)) limit: number,
		@Query('sort', new ParseArrayPipe()) sort,
		@Res() res: Response
	) {
		const { data, error } = await this.postService.getAllPublishedPosts({ page, limit })
		if (error) throw new HttpException(error, error.errorCode)

		const responseBody = new ResponseBody(
			data,
			HttpStatus.OK,
			this.i18nService.t('success_messages.ok')
		)
		return res.json(responseBody)
	}
}
