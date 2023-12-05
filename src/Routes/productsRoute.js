import { Router} from 'express';
import {ProductManager, Productos} from '../ProductManager.js';

const router = Router();
const manager = new ProductManager('./Productos.json');


router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await manager.mostrarProductos();

    if (limit) {
        const limitProduct = products.slice(0, limit);
        return res.json({
            message: "La cantidad de productos deseados obtenido",
             limitProduct});
    }

    res.json(products);

    } catch (e) {
        res.status(500).json({
            message: "El hubo un error en la obtencion de productos",
            error: e.message
        })
    }
});

router.get('/:id', async (req, res) => {

    const { id } = req.params;

    try {

    const producto = await manager.mostrarProductos();

    const productFilter = producto.find((prod) => prod.id === Number(id));

    if (productFilter) {
       return res.json({
        message: "Producto obtenido",
        productFilter});
    }

    } catch (e) {
        res.status(500).json({
            message: "El id no existe",
            error: e.message
        })
    }
});

router.post("/", async (req, res) => {

    const { title, description, code, price, stock, category, thumbnails} = req.body;

/*     if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    } */
    
    try {
        const newProduct = new Productos(
            title,
            description,
            price,
            category,
            thumbnails,
            stock,
            code
        );

        await manager.addProduct(newProduct)

        res.json({
            message: "Produto createdo",
            newProduct,
        });
    } catch (e) {

        res.status(500).json({
            message: "Hubo un error al crear el nuevo producto",
            error: e.message,
        });
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, price, stock, category, thumbnails } = req.body;

    try {
        await manager.updateProduct(Number(id), {
            title,
            description,
            price,
            stock,
            category,
            thumbnails
        });

        res.json({
            message: "Producto actualizado con éxito",
        });

    } catch (e) {
        res.status(500).json({
            message: "Hubo un error al actualizar el producto",
            error: e.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const products = await manager.mostrarProductos();
        
        const pid = products.findIndex((prod) => prod.id === Number(id))

    if (pid) {
        const deleteProduct = products.splice(pid, 1);


        await manager.saveFile()

        return res.json({
            message: "El producto ha sido eliminado",
            deleteProduct,
             });

    } else {
        return res.status(404).json({
            message: "Producto no encontrado",
        });
    }
    
    } catch (e) {
        res.status(500).json({
            message: "El hubo un error en la eliminacion del producto",
            error: e.message
        })
    }
});

router.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

export default router