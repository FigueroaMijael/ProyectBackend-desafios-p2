import { productModel } from '../../Models/products.model.js';
import { io } from '../../servidor.js';

class ProductsDao {
    async getAllProduct() {
        return await productModel.find();
    }

    async getProductById(id) {
        return await productModel.findById(id)
    }

    async createProduct(product) {
        return await productModel.create(product)
    }

    async updateProduct(id, product) {
        return await productModel.findByIdAndUpdate(id, product)
    }

    async deleteProduct(id) {
        try {
            console.log('Intentando encontrar el producto...');
            const existingProduct = await productModel.findById(id);
    
            if (!existingProduct) {
                console.log('Producto no encontrado.');
                return null; // Producto no encontrado
            }
    
            console.log('Producto encontrado, intentando eliminar...');
            const result = await productModel.findByIdAndDelete(id);
    
            console.log('Producto eliminado exitosamente.');
            return result;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    async broadcastProducts() {
        try {
            const products = await this.getAllProduct();
            io.emit("realTimeProducts_list", products); 
        } catch (e) {
            console.error("Hubo un error al emitir la lista de productos en tiempo real:", e.message);
        }
    }
}

export default new ProductsDao()