import { productModel } from '../../Models/products.model.js';

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
       return await socketServer.emit("realTimeProducts_list", getAllProduct());
    }
}

export default new ProductsDao()