// lib/models/Budget.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  categoryId: string;
  categoryName: string;
  limit: number;
  period: 'monthly' | 'yearly';
}

const BudgetSchema: Schema = new Schema({
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  limit: { type: Number, required: true },
  period: { type: String, enum: ['monthly', 'yearly'], required: true },
}, { timestamps: true });

export default mongoose.models.Budget || 
       mongoose.model<IBudget>('Budget', BudgetSchema);