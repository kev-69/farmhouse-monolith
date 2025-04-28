import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';  // Consider hashing passwords

const prisma = new PrismaClient();

async function main() {
    // Create sample shops
    const shop1 = await prisma.shop.create({
        data: {
            name: 'Tech Store',
            ownerName: 'Alice Johnson',
            email: 'techstore@example.com',
            password: await bcrypt.hash('securepassword', 10),  // Hash passwords for security
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
            password: await bcrypt.hash('securepassword', 10),
            location: '456 Fashion Avenue',
            phoneNumber: '987-654-3210',
            role: 'SHOP',
            isVerified: true,
        },
    });

    // Create sample categories
    const electronics = await prisma.category.create({
        data: { 
            name: 'Electronics', 
            description: 'Electronic gadgets and devices', 
            shopId: shop1.id  // Changed to shop1
        },
    });

    const clothing = await prisma.category.create({
        data: { 
            name: 'Clothing', 
            description: 'Apparel and accessories', 
            shopId: shop2.id  // Changed to shop2
        },
    });

    // Create sample products
    const product1 = await prisma.product.create({
        data: { 
            name: 'Smartphone', 
            price: 699.99, 
            description: 'Latest model smartphone',
            stockQuantity: 100,  // Added required field
            categoryId: electronics.id,
            shopId: shop1.id,
            productImages: ['smartphone1.jpg', 'smartphone2.jpg']
        },
    });

    const product2 = await prisma.product.create({
        data: { 
            name: 'T-Shirt', 
            price: 19.99, 
            description: 'Cotton t-shirt',
            stockQuantity: 500,  // Added required field
            categoryId: clothing.id,
            shopId: shop2.id,
            productImages: ['tshirt1.jpg', 'tshirt2.jpg']
        },
    });

    const laptop = await prisma.product.create({
        data: {
            name: 'Laptop',
            price: 999.99,
            description: 'High-performance laptop',
            stockQuantity: 50,   // Added required field
            categoryId: electronics.id,
            shopId: shop1.id,
            productImages: ['laptop1.jpg', 'laptop2.jpg'],
        },
    });

    const dress = await prisma.product.create({
        data: {
            name: 'Designer Dress',
            price: 199.99,
            description: 'Elegant evening dress',
            stockQuantity: 75,   // Added required field
            categoryId: clothing.id,
            shopId: shop2.id,
            productImages: ['dress1.jpg', 'dress2.jpg'],
        },
    });

    // Create a sample user
    const user1 = await prisma.user.create({
        data: { 
            email: 'user@example.com', 
            password: await bcrypt.hash('password123', 10),
            firstName: 'John',
            lastName: 'Doe',
            role: 'USER',
            isVerified: true
        },
    });

    const user2 = await prisma.user.create({
        data: { 
            email: 'bismarkobuobi19@gmail.com', 
            password: await bcrypt.hash('Kevl@r6069', 10),
            firstName: 'Bismark',
            lastName: 'Obuobi',
            role: 'USER',
            isVerified: true
        },
    });

    const address1 = await prisma.userAddress.create({
        data: {
            userId: user1.id,
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
        },
    });

    const address2 = await prisma.userAddress.create({
        data: {
            userId: user2.id,
            street: '456 Elm St',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            country: 'USA',
        },
    });

    // Create a sample order
    const order1 = await prisma.order.create({
        data: {
            userId: user1.id,
            totalAmount: 719.98,
            orderStatus: 'PROCESSING',  // Using a string literal for the status
            products: {
                connect: [
                    { id: product1.id },
                    { id: product2.id }
                ]
            }
        },
    });

    const order2 = await prisma.order.create({
        data: {
            userId: user2.id,
            totalAmount: 719.98,
            orderStatus: 'DELIVERED',  // Using a string literal for the status
            products: {
                connect: [
                    { id: product1.id },
                    { id: product2.id }
                ]
            }
        },
    });

    // Create order items (new relationship)
    await prisma.orderItem.create({
        data: {
            orderId: order1.id,
            productId: product1.id,
            quantity: 1,
            price: 699.99,
        },
    });

    await prisma.orderItem.create({
        data: {
            orderId: order2.id,
            productId: product2.id,
            quantity: 1,
            price: 19.99,
        },
    });

    // Create a sample payment
    await prisma.payment.create({
        data: {
            orderId: order1.id,
            amount: 719.98,
            method: 'CREDIT_CARD',
            status: 'COMPLETED',
        },
    });

    await prisma.payment.create({
        data: {
            orderId: order2.id,
            amount: 850.00,
            method: 'MOMO',
            status: 'COMPLETED',
        },
    });

    console.log('Database has been seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });