import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Req,
	Res,
	ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { HttpResponse } from 'src/common/utils/http.utils';
import { ProductDTO } from 'src/modules/products/dto/product.dto';
import CatchError from 'src/decorators/catch-error.decorator';

@Controller()
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get('/products')
	@CatchError()
	async getProducts(@Req() req: Request, @Res() res: Response) {
		const products = await this.productService.getProducts();
		const response = new HttpResponse(products, 'Ok', HttpStatus.OK);
		return res.status(HttpStatus.OK).json(response);
	}

	@Post('/products/create')
	@CatchError()
	async createProduct(
		@Body(new ValidationPipe()) payload: ProductDTO,
		@Res() res: Response
	) {
		const result = await this.productService.createProduct(payload);
		const response = new HttpResponse(result, 'Ok', HttpStatus.OK);
		return res.status(HttpStatus.CREATED).json(response);
	}

	@Patch('/products/:id/update')
	@CatchError()
	async updateProduct(@Req() req: Request, @Res() res: Response) {
		const result = await this.productService.updateProduct(
			req.params.id,
			req.body
		);
		const response = new HttpResponse(result, 'Ok', HttpStatus.OK);
		return res.status(HttpStatus.CREATED).json(response);
	}
}
