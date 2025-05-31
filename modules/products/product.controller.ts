// Handles CRUD routes for products
import { Request, Response } from 'express';
import { productService } from './product.service';
import { AppError } from "../../utils/errors";
import { successResponse, errorResponse } from "../../utils/response";

// Extend the Request interface to include the 'shop' property
interface AuthRequest extends Request {
    user?: { 
        id: string 
        shopId: string
        role: string
        verified: boolean
    };
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}


export const productController = {
    createProduct: async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.shopId) {
            res.status(401).json(errorResponse('Authentication required'));
            return;
        }

        if (!req.user?.verified) {
            res.status(403).json(errorResponse('Only verified shops can add products'));
            return;
        }

        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            res.status(400).json(errorResponse('At least one product image is required'));
            return;
        }

        const productData = {
            ...req.body,
            shopId: req.user.shopId,
            price: parseFloat(req.body.price), // Ensure price is a number
            stockQuantity: parseInt(req.body.stockQuantity, 10), // Ensure stockQuantity is an integer
            inStock: req.body.inStock === 'true', // Convert inStock to boolean
        };

        if (isNaN(productData.price) || isNaN(productData.stockQuantity)) {
            res.status(400).json(errorResponse('Invalid price or stock quantity'));
            return;
        }

        const fileArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        const product = await productService.createProduct(productData, fileArray);

        res.status(201).json(successResponse('Product created successfully', product));
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json(errorResponse(error.message));
        } else if (error instanceof Error) {
            res.status(400).json(errorResponse(error.message));
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
},

    getAllProducts: async (req: Request, res: Response) => {
        try {
            const products = await productService.getAllProducts();

            res.status(200).json(successResponse('Products retrieved successfully', products));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getProduct: async (req: Request, res: Response) => {
        try {
            const product = await productService.getProduct(req.params.productId);

            res.status(200).json(successResponse('Product retrieved successfully', product));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateProduct: async (req: AuthRequest, res: Response) => {
        try {
            const productId = req.params.productId;
            const shopId = req.user?.shopId;

            if (!shopId) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }

            // Handle files correctly whether they're an array or object
            const fileArray = req.files ? 
                (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : 
                undefined;

            const product = await productService.updateProduct(productId, req.body, shopId, fileArray);
            res.status(200).json(successResponse('Product updated successfully', product));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteProduct: async (req: AuthRequest, res: Response) => {
        try {
            const productId = req.params.productId;
            const shopId = req.user?.shopId;
            
            if (!shopId) {
                res.status(401).json(errorResponse('Authentication required'));
                return;
            }
            
            await productService.deleteProduct(productId, shopId);
            
            // Return a proper success response instead of a 204 no content
            res.status(200).json(successResponse('Product deleted successfully'));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    restoreProduct: async (req: AuthRequest, res: Response) => {
        try {
            const productId = req.params.productId;
            const shopId = req.user?.shopId;
            
            if (!shopId) {
                res.status(401).json(errorResponse('Authentication required'));
                return
            }
            
            const restoredProduct = await productService.restoreProduct(productId, shopId);
            
            res.status(200).json(successResponse('Product restored successfully', restoredProduct));
        } catch (error) {
            // console.error('Error restoring product:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('An unknown error occurred'));
            }
        }
    }
};