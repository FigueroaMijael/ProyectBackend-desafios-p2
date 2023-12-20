import { cartModel } from '../../Models/cart.model.js';

class CartDao {
    async getAllCart() {
        return await cartModel.find();
    }

    async getCartById(cartId) {
        return await cartModel.findById(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            // Manejar el caso en que el carrito no existe
            throw new Error('Cart not found');
        }

        // Comprobar si el producto ya está en el carrito
        const existingProduct = cart.products.find(product => product.productId === productId);

        if (existingProduct) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.products.push({
                productId,
                quantity
            });
        }

        // Guardar el carrito actualizado en la base de datos
        return await cart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const existingProduct = cart.products.find(product => product.productId === productId);

        if (existingProduct) {
            existingProduct.quantity = quantity;

            // Guardar el carrito actualizado en la base de datos
            return await cart.save();
        } else {
            throw new Error('Product not found in cart');
        }
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Filtrar los productos para excluir el producto que se va a eliminar
        cart.products = cart.products.filter(product => product.productId !== productId);

        // Guardar el carrito actualizado en la base de datos
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Limpiar todos los productos del carrito
        cart.products = [];

        // Guardar el carrito actualizado en la base de datos
        return await cart.save();
    }
}

export default new CartDao();