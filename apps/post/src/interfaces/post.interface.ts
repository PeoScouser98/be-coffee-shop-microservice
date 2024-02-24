import mongoose from 'mongoose'

export interface IPost {
	_id: mongoose.Types.ObjectId
	author: mongoose.Types.ObjectId
	title: string
	slug: string
	content: string
	thumbnail: string
	is_published: boolean
	is_draft: boolean
	published_at: Date | null
}
