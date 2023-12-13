import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	getHello(): string {
		return 'Server now is running'
	}
}
