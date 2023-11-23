import Product from '../models/products.model.js'
import Category from '../models/categories.model.js'

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

export const getProduct = async (req, res, next) => {
    const { id } = req.params
    try {
       const product = await Product.findById(id).populate('category') 
       if(!product) {
        return next(errorHandle(404, `Aucun produit trouvé`))
       }

       res.json(product)
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

        let uploadImage = image ? image : ""
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
    const { id } = req.params
    const { image, name, category, quantity, price } = req.body
    try {
        const product = await Product.findById(id)

        if(!name || !category || !quantity || !price) {
            return next(errorHandler(403, `Un nom, une catégorie, une quantity et un prix doivent être inclus dans le formulaire de création`))
        }

        let uploadImage = image ? image : product.image
        const existingProduct = await Product.findOne({ user: req.user.id, name })
        if(existingProduct && existingProduct._id.toString() !== id) {
            return next(errorHandler(409, `Le produit ${name} existe déjà`))
        }

        product.image = uploadImage
        product.name = name
        product.category = category
        product.quantity = quantity
        product.price = price

        await product.save()

        res.json(product)

    } catch (error) {
        next(error)
    }
}

export const updatePopular = async (req, res, next) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)

        product.image 
        product.name 
        product.category
        product.popular = !product.popular
        product.quantity 
        product.price 

        await product.save()

        res.json(product)

    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params
    try {
        if(!id) {
            return next(errorHandler(404, `Le client n'existe pas.`))
        }

        await Product.findByIdAndDelete(id)

        res.json({ message: `Le produit a été supprimé avec succès `})
    } catch (error) {
        next(error.message)
    }
}