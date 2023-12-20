import { Router } from 'express';
import cartDao from '../daos/dbManager/cart.dao.js';

const router = Router();

// Obtener todos los productos en el carrito
router.get('/', async (req, res) => {
    try {
        const cart = await cartDao.getAllCart();
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Agregar un producto al carrito
router.post('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartDao.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartDao.updateProductQuantity(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        const updatedCart = await cartDao.deleteProductFromCart(cartId, productId);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Limpiar todos los productos del carrito
router.delete('/:cartId/clear', async (req, res) => {
    const { cartId } = req.params;

    try {
        const updatedCart = await cartDao.clearCart(cartId);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

