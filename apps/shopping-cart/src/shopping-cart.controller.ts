import { JwtGuard } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { CurrentUser } from '@app/common/decorators/user.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Res,
	UseFilters,
	UseGuards
} from '@nestjs/common'
import { UserRoles } from 'apps/auth/src/constants/user.constant'
import { Response } from 'express'

@Controller('shopping-cart')
export class ShoppingCartController {
	@Patch(':userId')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtGuard)
	@Roles(UserRoles.CUSTOMER)
	@UseFilters(AllExceptionsFilter)
	public async upsertUserCart(@CurrentUser() user, @Body() payload, @Res() res: Response) {}

	public async deactivateUserCart() {}
}
