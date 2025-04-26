// Handles CRUD routes for products

import { Request, Response } from 'express';
import { productService } from './product.service';
// Extend the Request interface to include the 'shop' property
interface CustomRequest extends Request {
    user?: { 
        id: string 
        shopId: string
        role: string
        verified: boolean
    };
}


export const productController = {
    createProduct: async (req: CustomRequest, res: Response) => {
        try {
            // Include shopId from authenticated shop
            const productData = {
                ...req.body,
                shopId: req.user?.shopId
            };

            // check if shop is verified before allowing to add products

            const product = await productService.createProduct(productData);

            res.status(201).json({ message: 'Product added successfully', product });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getAllProducts: async (req: Request, res: Response) => {
        try {
            const products = await productService.getAllProducts();

            res.status(200).json(products);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getProduct: async (req: Request, res: Response) => {
        try {
            const product = await productService.getProduct(req.params.id);

            res.status(200).json(product);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateProduct: async (req: CustomRequest, res: Response) => {
        try {
            // check if shop is verified before allowing to update their products

            const product = await productService.updateProduct(
                req.params.id, 
                req.body, 
                req.user?.shopId || ''
            );
            
            res.status(200).json(product);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    deleteProduct: async (req: CustomRequest, res: Response) => {
        try {
            await productService.deleteProduct(
                req.params.id, 
                req.user?.shopId || ''
            );

            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },
};