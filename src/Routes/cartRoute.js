import { Router } from 'express';
import { ProductManager } from '../ProductManager.js';
import { CartManager } from '../cartManager.js';

const productManager = new ProductManager('./Productos.json');
const cartManager = new CartManager('./Carts.json');
const router = Router();

router.post('/', (req, res) => {
  const result = cartManager.createNewCart();

  if (result) {
    res.status(200).json(
      { message: 'Nuevo carrito creado con éxito.',
        result,});
  } else {
    res.status(500).json({ message: 'Error al crear un nuevo carrito.' });
  }
});

router.post('/:cid/productos/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;

    const carrito = cartManager.mostrarCarrito();


    const cartExists = carrito.find((cart) => cart.id === Number(cid));
    if (!cartExists) {
      return res.status(404).json({ message: 'Carrito no encontrado.' });
    }

    const producto = await productManager.mostrarProductos();

    const product = producto.find((prod) => prod.id === Number(pid));
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const result = await cartManager.addProductToCart(Number(cid), Number(pid), quantity);

    if (result) {
      res.status(200).json({ message: 'Producto agregado al carrito con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al agregar el producto al carrito.' });
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


router.get('/:cid', (req, res) => {

  const { cid } = req.params

  const carrito = cartManager.mostrarCarrito()

  const cart = carrito.find((cartId) => cartId.id === Number(cid))

if (cart) {
  return res.json({
    message: "carrito obtenido",
    cart
  })
} else {
  res.status(404).json({ message: 'Carrito no encontrado' });
}
});



export default router;
