import { Types } from 'mongoose'
import { IUserToken } from '../interfaces/user-token.interface'
import { IsArray, IsJWT, IsMongoId, IsNotEmpty, IsString } from 'class-validator'

export class UserTokenDTO implements IUserToken {
	@IsMongoId()
	_id: Types.ObjectId

	@IsMongoId({ message: 'User' })
	user: Types.ObjectId

	@IsNotEmpty({ message: 'Public key được trống' })
	@IsString({ message: 'Public key phải là 1 chuỗi' })
	publicKey: string

	@IsNotEmpty({ message: 'Private key được trống' })
	@IsString({ message: 'Private key phải là 1 chuỗi' })
	privateKey: string

	@IsJWT({ message: 'Token không hợp lệ' })
	refreshToken: string

	@IsArray({ each: true })
	usedRefreshTokens: Array<string>
}
