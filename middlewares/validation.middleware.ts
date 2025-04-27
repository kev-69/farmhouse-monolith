import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schemas: {
  body?: AnyZodObject,
  query?: AnyZodObject,
  params?: AnyZodObject
}) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schemas.body) {
      req.body = await schemas.body.parseAsync(req.body);
    }
    if (schemas.query) {
      req.query = await schemas.query.parseAsync(req.query);
    }
    if (schemas.params) {
      req.params = await schemas.params.parseAsync(req.params);
    }
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    res.status(500).json({ message: 'Internal server error during validation' });
  }
};