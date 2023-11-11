import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { JsonWebTokenError } from 'jsonwebtoken';

export class HttpResponse<T> {
	metadata: T;
	message: string;
	statusCode: number;
	constructor(data: T, message: string, status: HttpStatus) {
		this.metadata = data;
		this.message = message;
		this.statusCode = status;

		return this;
	}
}

export class HttpErrorResponse {
	message: string;
	statusCode: number;
	constructor(error: HttpException | Error) {
		this.message = error.message;
		this.statusCode =
			error instanceof HttpException
				? error.getStatus()
				: error instanceof JsonWebTokenError
				? HttpStatus.UNAUTHORIZED
				: HttpStatus.INTERNAL_SERVER_ERROR;

		return this;
	}
}

export class ServiceResult<T> {
	data: T | null;
	error: {
		message: string;
		statusCode: HttpStatus;
	} | null;
	constructor(
		data: T | null,
		error: { message: string; statusCode: HttpStatus }
	) {
		this.data = data;
		this.error = error;

		return this;
	}
}
