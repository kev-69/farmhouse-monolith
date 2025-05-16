import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Admin user details - you can adjust these as needed
    const adminDetails = {
      email: 'admin@farmghana.com',
      password: 'Admin@123456', // This will be hashed before storage
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true
    };

    // Check if the admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminDetails.email }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminDetails.password, saltRounds);

    // Create the admin user
    const newAdmin = await prisma.user.create({
      data: {
        email: adminDetails.email,
        password: hashedPassword,
        firstName: adminDetails.firstName,
        lastName: adminDetails.lastName,
        role: adminDetails.role,
        isVerified: adminDetails.isVerified
      }
    });

    console.log('Admin user created successfully:', {
      id: newAdmin.id,
      email: newAdmin.email,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      role: newAdmin.role
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Execute the function
createAdminUser();