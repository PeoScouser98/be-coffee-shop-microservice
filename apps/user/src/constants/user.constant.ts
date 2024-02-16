/**
 * @enum
 */
export enum UserRoles {
	ADMIN = 'Admin',
	STAFF = 'Staff',
	MANAGER = 'Manager',
	CUSTOMER = 'Customer'
}

/**
 * @constant
 */
export const USER_REPOSITORY = 'USER_REPOSITORY' as const
export const USER_TOKEN_REPOSITORY = 'USER_TOKEN_REPOSITORY' as const
export const USER_COLLECTION = 'users' as const
export const USER_TOKEN_COLLECTION = 'user_tokens' as const
export const USER_SERVICE = 'USER' as const
