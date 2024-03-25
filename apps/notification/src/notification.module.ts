import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { DatabaseModule } from '@app/database'
import { RmqModule } from '@app/rmq'
import { ConfigModule } from '@nestjs/config'
import { NotificationRepository } from './notification.repository'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: './apps/notification/.env'
		}),
		DatabaseModule,
		RmqModule
	],
	controllers: [NotificationController],
	providers: [
		NotificationService,
		{ useClass: NotificationRepository, provide: NotificationRepository.provide }
	]
})
export class NotificationModule {}
