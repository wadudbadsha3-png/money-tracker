<<<<<<< HEAD
// lib/models/Transaction.ts

=======
// lib/models/Transaction.ts - সরলীকৃত ভার্সন (নিশ্চিত কাজ করবে)
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
import mongoose from 'mongoose';

// পুরনো মডেল ক্লিয়ার করুন
if (mongoose.models.Transaction) {
  delete mongoose.models.Transaction;
}

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
<<<<<<< HEAD
  
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
=======
  fromAccount: { type: String },
  toAccount: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// শুধু প্রয়োজনীয় ইন্ডেক্স
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ type: 1 });

// সহজ মেথড
TransactionSchema.statics.findActive = function() {
  return this.find({ isDeleted: false });
};

// অ্যাসেট সামারি (সহজ ভার্সন)
TransactionSchema.statics.getAssetSummary = async function() {
  const transactions = await this.find({ isDeleted: false }).lean();
  
  let totalIncome = 0;
  let totalExpense = 0;
  let totalSavings = 0;
  let loansGiven = 0;
  let loansReturned = 0;
  
  for (const t of transactions) {
    if (t.type === 'income' && t.category !== 'Loan') totalIncome += t.amount;
    if (t.type === 'expense') {
      if (t.category !== 'Savings') totalExpense += t.amount;
      if (t.category === 'Lend') loansGiven += t.amount;
    }
    if (t.type === 'transfer' && t.category === 'Savings') totalSavings += t.amount;
    if (t.category === 'Return' && t.type === 'income') loansReturned += t.amount;
  }
  
  const netLoansGiven = loansGiven - loansReturned;
  const bankBalance = totalIncome - totalExpense - totalSavings - loansGiven;
  const savingsBalance = totalSavings;
  const totalAsset = bankBalance + savingsBalance + netLoansGiven;
  
  return { totalIncome, totalExpense, totalSavings, netLoansGiven, bankBalance, savingsBalance, loansGiven, loansReturned, totalAsset };
};

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export default Transaction;
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
