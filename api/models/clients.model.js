import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    bill: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            AddedAt: {
                type: Date,
                default: new Date
            }
        }
    ],
    cards: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            count: {
                type: Number,
                default: 10
            },
            AddedAt: {
                type: Date,
                default: new Date
            }
        }
    ],
}, { timestamps: true })

const Client = mongoose.model('Client', clientSchema)

export default Client