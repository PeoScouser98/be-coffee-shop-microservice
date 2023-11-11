import 'dotenv/config';

export default () => {
	const { env } = process;

	return {
		port: +env.PORT,
		saltRound: +env.SALT_ROUND,
		jwt: {
			algorithm: 'RS256',
			accessTokenExpires: '1h',
			refreshTokenExpires: '7d'
		},
		crypto: {
			type: 'rsa',
			options: {
				modulusLength: 4096,
				publicKeyEncoding: {
					type: 'pkcs1',
					format: 'pem'
				},
				privateKeyEncoding: {
					type: 'pkcs1',
					format: 'pem'
				}
			}
		},
		database: {
			localAddress: env.MONGO_HOST,
			localPort: +env.MONGO_PORT,
			dbName: env.MONGO_DB_NAME,
			uri: `${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB_NAME}`,
			maxPoolSize: 100,
			connectTimeoutMS: 10000
		},
		googleapis: {
			clientId: '',
			clientSecret: '',
			refreshToken: '',
			redirectUrl: ''
		},
		mailer: {
			user: '',
			password: ''
		}
	};
};
