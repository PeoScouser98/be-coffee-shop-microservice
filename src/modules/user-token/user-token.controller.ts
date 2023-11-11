import { Controller } from '@nestjs/common';
import { UserTokenService } from './user-token.service';

@Controller()
export class UserTokenController {
	constructor(private readonly userTokenService: UserTokenService) {}
}
