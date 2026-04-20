// lib/models/Category.ts
import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  color: { type: String, default: '#808080' },
}, {
  timestamps: true
})

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)