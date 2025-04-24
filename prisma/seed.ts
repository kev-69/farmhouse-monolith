import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create sample categories
    const electronics = await prisma.category.create({
        data: { name: 'Electronics', description: 'Electronic gadgets and devices' },
    });

    const clothing = await prisma.category.create({
        data: { name: 'Clothing', description: 'Apparel and accessories' },
    });

    // Create sample products
    await prisma.product.create({
        data: { name: 'Smartphone', price: 699.99, description: 'Latest model smartphone', categoryId: electronics.id },
    });

    await prisma.product.create({
        data: { name: 'T-Shirt', price: 19.99, description: 'Cotton t-shirt', categoryId: clothing.id },
    });

    // Create a sample user
    const user = await prisma.user.create({
        data: { email: 'user@example.com', password: 'password123', name: 'John Doe', role: 'USER' },
    });

    // Create a sample order
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            productIds: [],
            totalAmount: 719.98,
            status: 'PENDING',
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