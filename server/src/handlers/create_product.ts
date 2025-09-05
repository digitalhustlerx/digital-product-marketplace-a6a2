import { type CreateProductInput, type Product } from '../schema';

export async function createProduct(input: CreateProductInput): Promise<Product> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new product (digital product, number service, or proxy service)
    // and persisting it in the database. Used by administrators to add new products.
    return Promise.resolve({
        id: 0,
        name: input.name,
        description: input.description,
        category: input.category,
        price: input.price,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
    } as Product);
}