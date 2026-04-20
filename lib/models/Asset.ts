// lib/models/Asset.ts

import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  cashBalance: { type: Number, default: 0 },
  totalLend: { type: Number, default: 0 },
  totalSavings: { type: Number, default: 0 },
  totalAsset: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema);