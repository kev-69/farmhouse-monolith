// Reusable helper functions
export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
        title: 'Farmhouse API Documentation',
        version: '1.0.0',
        description: 'API documentation for Farmhouse e-commerce platform',
        },
        servers: [
        {
            url: 'http://localhost:3000/api', // Update with your server URL
        },
        ],
    },
    apis: ['./src/modules/**/*.ts'], // Path to the API docs
};

export function paginateArray<T>(array: T[], page: number, limit: number): T[] {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return array.slice(startIndex, endIndex);
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
}

export function formatCurrency(amount: number): string {
    return `GHS${amount.toFixed(2)}`; // Format currency to GHSX.XX
}