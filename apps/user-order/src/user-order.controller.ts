import { JwtGuard } from '@app/common'
import { Roles } from '@app/common/decorators/roles.decorator'
import { User } from '@app/common/decorators/user.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import { Controller, Get, HttpCode, HttpStatus, UseFilters, UseGuards } from '@nestjs/common'
import UserRoles from 'apps/auth/src/constants/user.constant'

@Controller('order')
export class OrderController {
	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles(UserRoles.CUSTOMER)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	public async getOrderReview(@User() user) {}
}
