/*

import { NextFunction, Request, Response } from 'express'
import * as chalk from 'chalk'
import { HttpException, HttpStatus } from '@nestjs/common'
import { JsonWebTokenError } from 'jsonwebtoken'

class HttpErrorResponse {
	message: string
	statusCode: number
	constructor(error: HttpException | Error) {
		this.message = error.message
		this.statusCode =
			error instanceof HttpException
				? error.getStatus()
				: error instanceof JsonWebTokenError
					? HttpStatus.UNAUTHORIZED
					: HttpStatus.INTERNAL_SERVER_ERROR

		return this
	}
}

export default function CatchException() {
	return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		descriptor.value = async function (req: Request, res: Response, next?: NextFunction) {
			const _this = this // Preserve instance method
			try {
				await originalMethod.apply(_this, [req, res, next])
			} catch (error) {
				const httpException = new HttpErrorResponse(error)
				if (process.env.NODE_ENV === 'development') {
					console.log(chalk.red.bold('Error'), httpException.message)
				}
				return res.status(httpException.statusCode).json(httpException)
			}
		}
	}
}

*/
