// lib/models/Transaction.ts - সরলীকৃত ভার্সন (Loan Taken & Repayment সহ)
import mongoose from 'mongoose';

// পুরনো মডেল ক্লিয়ার করুন
if (mongoose.models.Transaction) {
  delete mongoose.models.Transaction;
}

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['income', 'expense', 'transfer', 'liability'], // 🆕 liability যোগ করা হয়েছে
    required: true 
  },
  category: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  
  // লেন্ড/রিটার্ন ট্র্যাকিং এর জন্য
  personName: { 
    type: String, 
    default: null,
    index: true
  },
  
  // সেভিংস ট্র্যাকিং এর জন্য
  accountName: { 
    type: String, 
    default: null,
    index: true
  },
  
  // 🆕 লোন ট্র্যাকিং এর জন্য
  loanPersonName: { 
    type: String, 
    default: null,
    index: true
  },
  
  // লোন নেওয়ার ফ্ল্যাগ
  isLoanTaken: { 
    type: Boolean, 
    default: false 
  },
  
  // লোন পরিশোধের ফ্ল্যাগ
  isLoanRepayment: { 
    type: Boolean, 
    default: false 
  },
  
  fromAccount: { type: String },
  toAccount: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// কম্পাউন্ড ইন্ডেক্স (better query performance)
TransactionSchema.index({ category: 1, personName: 1 });
TransactionSchema.index({ category: 1, accountName: 1 });
TransactionSchema.index({ category: 1, loanPersonName: 1 });
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ type: 1 });

// সহজ মেথড
TransactionSchema.statics.findActive = function() {
  return this.find({ isDeleted: false });
};

// অ্যাসেট সামারি (আপডেটেড - লায়েবিলিটি সহ)
TransactionSchema.statics.getAssetSummary = async function() {
  const transactions = await this.find({ isDeleted: false }).lean();
  
  let totalIncome = 0;
  let totalExpense = 0;
  let totalSavings = 0;
  let loansGiven = 0;
  let loansReturned = 0;
  let totalLiability = 0; // 🆕 লায়েবিলিটি (লোন নেওয়া)
  let totalLiabilityRepaid = 0; // 🆕 লায়েবিলিটি পরিশোধ
  
  for (const t of transactions) {
    // ইনকাম
    if (t.type === 'income' && t.category !== 'Loan') {
      totalIncome += t.amount;
    }
    
    // এক্সপেন্স (সেভিংস ছাড়া)
    if (t.type === 'expense') {
      if (t.category !== 'Savings') {
        totalExpense += t.amount;
      }
      if (t.category === 'Lend') {
        loansGiven += t.amount;
      }
    }
    
    // ট্রান্সফার (সেভিংস)
    if (t.type === 'transfer' && t.category === 'Savings') {
      totalSavings += t.amount;
    }
    
    // রিটার্ন
    if (t.category === 'Return' && t.type === 'expense') {
      loansReturned += t.amount;
    }
    
    // 🆕 লায়েবিলিটি (Loan Taken)
    if (t.category === 'Loan Taken' && t.type === 'liability') {
      totalLiability += t.amount;
    }
    
    // 🆕 লায়েবিলিটি পরিশোধ (Loan Repayment)
    if (t.category === 'Loan Repayment' && t.type === 'liability') {
      totalLiabilityRepaid += t.amount;
    }
  }
  
  // নেট লায়েবিলিটি (বাকি লোন)
  const netLiability = totalLiability - totalLiabilityRepaid;
  
  // নেট লোন দেওয়া (যে টাকা বাকি আছে ফেরত পাওয়ার)
  const netLoansGiven = loansGiven - loansReturned;
  
  // ব্যাংক ব্যালেন্স
  const bankBalance = totalIncome - totalExpense - totalSavings - loansGiven;
  
  // সেভিংস ব্যালেন্স
  const savingsBalance = totalSavings;
  
  // 🆕 টোটাল অ্যাসেট (লায়েবিলিটি বাদ দিয়ে)
  const totalAsset = bankBalance + savingsBalance + netLoansGiven - netLiability;
  
  return { 
    totalIncome, 
    totalExpense, 
    totalSavings, 
    netLoansGiven, 
    bankBalance, 
    savingsBalance, 
    loansGiven, 
    loansReturned,
    totalLiability,      // 🆕 মোট লোন নেওয়া
    totalLiabilityRepaid, // 🆕 মোট লোন পরিশোধ
    netLiability,        // 🆕 বাকি লোন
    totalAsset 
  };
};

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export default Transaction;