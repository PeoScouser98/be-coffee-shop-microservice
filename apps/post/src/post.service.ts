import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { PostDTO, PostValidator } from './dto/post.dto'
import { PostRepository } from './post.repository'
import { I18nService } from '@app/i18n'
import { ServiceResult } from '@app/common'
import { z } from 'zod'
import { FilterQuery, PaginateOptions } from 'mongoose'
import { PostDocument } from './schemas/post.schema'
import { User } from 'apps/auth/src/schemas/user.schema'

@Injectable()
export class PostService {
	constructor(
		@Inject(PostRepository.provide) private readonly postRepository: PostRepository,
		private readonly i18nService: I18nService
	) {}

	public async createPost(payload: PostDTO) {
		const createdPost = await this.postRepository.create(payload)
		if (!createdPost)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.post.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(createdPost)
	}

	public async updatePostById(
		postId: string,
		payload: z.infer<ReturnType<typeof PostValidator.partial>>
	) {
		const updatedPost = await this.postRepository.findByIdAndUpdate(postId, payload)
		if (!updatedPost)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.post.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResult(updatedPost)
	}

	public async deletePost(postId: string) {
		const deletedPost = await this.postRepository.findAndDeleteById(postId)
		if (!deletedPost)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.post.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(deletedPost)
	}

	public async publishPost(postId: string) {
		const publishedPost = await this.postRepository.findByIdAndUpdate(postId, {
			is_published: true,
			is_draft: false,
			published_at: new Date()
		})

		if (!publishedPost)
			return new ServiceResult(null, {
				message: this.i18nService.t('success_messages.post.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResult(publishedPost)
	}

	public async getAllDraftPosts() {
		const draftPosts = await this.postRepository.find({ is_draft: true })
		return new ServiceResult(draftPosts)
	}

	public async getAllPublishedPosts(options: PaginateOptions) {
		const publishedPosts = await this.postRepository.paginate(
			{ is_published: true },
			{ ...options, populate: { path: User.name } }
		)
		return new ServiceResult(publishedPosts)
	}

	public async getAllPosts(filterQuery?: FilterQuery<PostDocument>) {
		const posts = await this.postRepository.findOne({ ...filterQuery })
		return new ServiceResult(posts)
	}

	public async getPostById(postId: string) {
		const post = await this.postRepository.findOneById(postId)
		if (!post)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.post.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(post)
	}

	public async getPostBySlug(slug: string) {
		const post = await this.postRepository.findOne({ slug })
		if (!post)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.post.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(post)
	}
}
