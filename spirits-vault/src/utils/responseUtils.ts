import { Response } from 'express';

/**
 * Utility functions for handling HTTP responses
 */

/**
 * Send a success response
 * @param res Express response
 * @param data Response data
 * @param statusCode HTTP status code (default: 200)
 */
export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
  res.status(statusCode).json(data);
}

/**
 * Send a success response with created status
 * @param res Express response
 * @param data Response data
 */
export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

/**
 * Send an error response
 * @param res Express response
 * @param error Error object or message
 * @param statusCode HTTP status code (default: 400)
 */
export function sendError(res: Response, error: Error | string, statusCode: number = 400): void {
  const message = error instanceof Error ? error.message : error;
  res.status(statusCode).json({ message });
}

/**
 * Send a not found error response
 * @param res Express response
 * @param entity Entity that was not found
 */
export function sendNotFound(res: Response, entity: string): void {
  res.status(404).json({ message: `${entity} not found` });
}

/**
 * Send an unauthorized error response
 * @param res Express response
 * @param message Error message (default: 'Unauthorized')
 */
export function sendUnauthorized(res: Response, message: string = 'Unauthorized'): void {
  res.status(401).json({ message });
} 