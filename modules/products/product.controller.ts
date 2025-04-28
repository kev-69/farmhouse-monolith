// Handles CRUD routes for products
import { Request, Response } from 'express';
import { productService } from './product.service';
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
            // Ensure user is authenticated
            if (!req.user?.shopId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            // check if shop is verified before allowing to add products
            if (!req.user?.verified) {
                res.status(403).json({ message: 'Only verified shops can add products' });
                return;
            }

            // Check if files exist and handle both array and object format
            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                res.status(400).json({ message: 'At least one product image is required' });
                return;
            }

            // Include shopId from authenticated shop
            const productData = {
                ...req.body,
                shopId: req.user.shopId
            };

            // Parse numeric fields (safeguard in case schema preprocessing doesn't work)
            if (typeof productData.price === 'string') {
                productData.price = parseFloat(productData.price);
            }
            
            if (typeof productData.stockQuantity === 'string') {
                productData.stockQuantity = parseInt(productData.stockQuantity, 10);
            }

            // Ensure files is properly handled as an array
            const fileArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
            const product = await productService.createProduct(productData, fileArray);

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

    updateProduct: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const shopId = req.user?.shopId;

            if (!shopId) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            // Handle files correctly whether they're an array or object
            const fileArray = req.files ? 
                (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : 
                undefined;

            const product = await productService.updateProduct(id, req.body, shopId, fileArray);
            res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An error occurred while updating the product' });
            }
        }
    },

    deleteProduct: async (req: AuthRequest, res: Response) => {
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