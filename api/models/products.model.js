import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number
    }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

export default Product