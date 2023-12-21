import { Router } from 'express';
import cartDao from '../daos/dbManager/cart.dao.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartDao.getAllCart();
        res.json(carts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/:cartId", async (req, res) => {

    const { cartId } = req.params;
    try {
        const cart = await cartDao.getCartById(cartId);
        res.json(cart);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/:cartId/products/:productId/:quantity', async (req, res) => {
    const { cartId, productId, quantity } = req.params;
/*     const { quantity } = req.body; */

    try {
        const updatedCart = await cartDao.addProductToCart(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:cartId/products/:productId/:quantity', async (req, res) => {
    const { cartId, productId, quantity } = req.params;
    /*     const { quantity } = req.body; */

    try {
        const updatedCart = await cartDao.updateProductQuantity(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        const updatedCart = await cartDao.deleteProductFromCart(cartId, productId);
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:cartId/clear', async (req, res) => {
    const { cartId } = req.params;

    try {
        const updatedCart = await cartDao.clearCart(cartId);
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;