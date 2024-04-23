import { JwtGuard } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
import { Controller, Get, HttpCode, HttpStatus, UseFilters, UseGuards } from '@nestjs/common'
import { UserRoles } from 'apps/auth/src/constants/user.constant'

@Controller('order')
export class OrderController {
	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles(UserRoles.CUSTOMER)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async getOrderReview(@CurrentUser() user) {}
}
