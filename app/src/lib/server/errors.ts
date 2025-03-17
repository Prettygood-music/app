/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
	field?: string;

	constructor(message: string, field?: string) {
		super(message);
		this.name = 'ValidationError';
		this.field = field;
	}
}

/**
 * Custom error class for not found errors
 */
export class NotFoundError extends Error {
	resource: string;

	constructor(resource: string, id?: string) {
		const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;

		super(message);
		this.name = 'NotFoundError';
		this.resource = resource;
	}
}

/**
 * Custom error class for authentication errors
 */
export class AuthenticationError extends Error {
	constructor(message = 'Authentication required') {
		super(message);
		this.name = 'AuthenticationError';
	}
}

/**
 * Custom error class for authorization errors
 */
export class AuthorizationError extends Error {
	constructor(message = 'You do not have permission to perform this action') {
		super(message);
		this.name = 'AuthorizationError';
	}
}
