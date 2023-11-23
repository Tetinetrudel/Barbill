import Category from '../models/categories.model.js'
import { errorHandler } from '../middleware/errorHandler.js'

export const getCategories = async (req, res, next) => {
    const { id } = req.user
    try {
        const category = await Category.find({ user: id })
        if(!category.length) {
            return next(errorHandler(404, `Aucune catégorie trouvée`))
        }

        res.json(category)
    } catch (error) {
        next(error)
    }
}

export const addCategory = async (req, res, next) => {
    const { name } = req.body
    try {
        const existingCategory = await Category.findOne({ name })
        if(existingCategory) {
            return next(errorHandler(409, `La catégorie ${name} existe déjà. Veuillez choisir un nouveau nom`))
        }

        const newCategory = new Category({
            user: req.user.id,
            name
        })

        const category = await newCategory.save()

        res.json(category)
    } catch (error) {
        next(error)
    }
}

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params

    try {
        if(!id) {
            return next(errorHandler(404, `La catégorie n'existe pas.`))
        }

        await Category.findByIdAndDelete(id)

        res.json({ message: `Catégorie supprimé avec succès `})
    } catch (error) {
        next(error.message)
    }
}