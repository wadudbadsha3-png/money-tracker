// lib/models/Transaction.ts

import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  
  // 🆕 লেন্ড/রিটার্ন ট্র্যাকিং এর জন্য
  personName: { 
    type: String, 
    default: null,
    index: true  // দ্রুত খুঁজে পাওয়ার জন্য
  },
  
  // 🆕 সেভিংস ট্র্যাকিং এর জন্য
  accountName: { 
    type: String, 
    default: null,
    index: true  // দ্রুত খুঁজে পাওয়ার জন্য
  },
  
}, { timestamps: true });

// কম্পাউন্ড ইন্ডেক্স (better query performance)
TransactionSchema.index({ category: 1, personName: 1 });
TransactionSchema.index({ category: 1, accountName: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);