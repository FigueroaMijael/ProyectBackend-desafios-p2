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
        return await productModel.findByIdAndDelete(id)
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