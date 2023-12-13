import { NextFunction, Request, Response } from 'express'
import { HttpErrorResponse } from '../common/helpers/http.helper'
import Log from '../utils/log.utils'

/**
 * Catch HTTP errors
 * @decorator
 */
const CatchException =
	() => (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value
		descriptor.value = async function (req: Request, res: Response, next?: NextFunction) {
			const __this = this // Preserve instance method
			try {
				await originalMethod.apply(__this, [req, res, next])
			} catch (error) {
				const httpException = new HttpErrorResponse(error)
				Log.error(httpException.message)
				return res.status(httpException.statusCode).json(httpException)
			}
		}
	}

export default CatchException
