import Product from '../models/products.model.js'
import { errorHandler } from '../middleware/errorHandler.js'

export const getProducts = async (req, res, next) => {
    const { id } = req.user
    try {
        const products = await Product.find({ user: id }).populate('category')
        if(!products.length) {
            return next(errorHandler(404, 'Aucun produit trouvé'))
        }

        res.json(products)
    } catch (error) {
        next(error)
    }
}

export const addProduct = async (req, res, next) => {
    const { image, name, category, quantity, price } = req.body
    try {
        if(!name || !category || !quantity || !price) {
            return next(errorHandler(403, `Un nom, une catégorie, une quantity et un prix doivent être inclus dans le formulaire de création`))
        }

        let uploadImage
        if(!image) {
            uploadImage = ""
        } else {
            uploadImage = image
        }
        const existingProduct = await Product.findOne({ user: req.user.id, name })
        if(existingProduct) {
            return next(errorHandler(409, `Le produit ${name} existe déjà`))
        }

        const newProduct = new Product({
            user: req.user.id,
            image: uploadImage,
            name,
            category,
            price
        })

        const product = await newProduct.save()

        res.json(product)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {

}

export const deleteProduct = async (req, res, next) => {

}