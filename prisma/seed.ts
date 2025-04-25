import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create sample shops
    const shop1 = await prisma.shop.create({
        data: {
            name: 'Tech Store',
            ownerName: 'Alice Johnson',
            email: 'techstore@example.com',
            password: 'securepassword',
            location: '123 Tech Street',
            phoneNumber: '123-456-7890',
            role: 'SHOP',
            isVerified: true,
        },
    });

    const shop2 = await prisma.shop.create({
        data: {
            name: 'Fashion Hub',
            ownerName: 'Bob Smith',
            email: 'fashionhub@example.com',
            password: 'securepassword',
            location: '456 Fashion Avenue',
            phoneNumber: '987-654-3210',
            role: 'SHOP',
            isVerified: true,
        },
    });

     // Create sample categories
     const electronics = await prisma.category.create({
        data: { name: 'Electronics', description: 'Electronic gadgets and devices', shopId: shop2.id }, // Add this line if you want to associate with a shop
    });

    const clothing = await prisma.category.create({
        data: { name: 'Clothing', description: 'Apparel and accessories', shopId: shop1.id }, // Add this line if you want to associate with a shop
    });

    // Create sample products
    // Add shopId to the first product
    const product1 = await prisma.product.create({
        data: { 
            name: 'Smartphone', 
            price: 699.99, 
            description: 'Latest model smartphone', 
            categoryId: electronics.id,
            shopId: shop1.id,  // Add this line
            productImages: []  // Add this line if it's required
        },
    });

    const product2 = await prisma.product.create({
        data: { 
            name: 'T-Shirt', 
            price: 19.99, 
            description: 'Cotton t-shirt', 
            categoryId: clothing.id,
            shopId: shop2.id,  // Add this line
            productImages: []  // Add this line if it's required
        },
    });

    await prisma.product.create({
        data: {
            name: 'Laptop',
            price: 999.99,
            description: 'High-performance laptop',
            categoryId: electronics.id,
            shopId: shop1.id,
            productImages: ['laptop1.jpg', 'laptop2.jpg'],
        },
    });

    await prisma.product.create({
        data: {
            name: 'Designer Dress',
            price: 199.99,
            description: 'Elegant evening dress',
            categoryId: clothing.id,
            shopId: shop2.id,
            productImages: ['dress1.jpg', 'dress2.jpg'],
        },
    });

    // Create a sample user
    const user = await prisma.user.create({
        data: { 
            email: 'user@example.com', 
            password: 'password123', 
            firstName: 'John',  // Change this
            lastName: 'Doe',    // Add this
            role: 'USER',
            isVerified: true    // Add this required field
        },
    });

    // Create a sample order
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            productIds: [],
            totalAmount: 719.98,
            status: 'PENDING',
            products: {
                connect: [
                    { id: product1.id },
                    { id: product2.id }
                ]
            }
        },
    });

    // Create a sample payment
    await prisma.payment.create({
        data: {
            orderId: order.id,
            amount: 719.98,
            method: 'CREDIT_CARD',
            status: 'COMPLETED',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });