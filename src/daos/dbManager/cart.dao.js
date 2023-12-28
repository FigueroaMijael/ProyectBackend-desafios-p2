import { cartModel } from '../../Models/cart.model.js';
import { productModel } from '../../Models/products.model.js';
import mongoose from 'mongoose';

class CartDao {
    async getAllCart(cartId) {
        const cart = await cartModel.findOne({ _id: cartId }).populate('products.product');
    
        if (!cart) {
            const newCart = await cartModel.create({ products: [] });
            return [newCart];
        }
    
        return [cart]; // Devolver un array con el carrito para mantener la consistencia con la plantilla
    }
    
    async getCartById(id) {
        return await cartModel.findById(id);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await cartModel.findOne({ _id: cartId }).populate('products.product', 'title price thumbnail');
    
        if (!cart) {
            throw new Error('Cart not found');
        }
    
        const existingProductIndex = cart.products.findIndex(p => p.product && p.product.equals(productId));
    
        if (existingProductIndex !== -1) {
            // If product exists, increase quantity
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // If product doesn't exist, add a new product to the cart
            const product = await productModel.findById(productId);
    
            if (!product) {
                throw new Error('Product not found');
            }
    
            cart.products.push({
                _id: new mongoose.Types.ObjectId(), // Assign a new ObjectId to the product
                product: product._id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: quantity
            });
        }
    
        console.log('Saving cart:');
        console.log('cart:', cart);
    
        // Update the cart in the database
        await cartModel.findByIdAndUpdate(cartId, { products: cart.products });
    
        return cart.products;
    }
    
    

    
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const existingProduct = cart.products.find(product => product.productId === productId);

        if (existingProduct) {
            existingProduct.quantity = quantity;

            return await cart.save();
        } else {
            throw new Error('Product not found in cart');
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                { $pull: { products: { _id: productId } } },
                { new: true }
            );
    
            if (!cart) {
                throw new Error('Cart not found');
            }
    
            return cart;
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }
    

    async clearCart(cartId) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.products = [];

        return await cart.save();
    }
}

export default new CartDao();