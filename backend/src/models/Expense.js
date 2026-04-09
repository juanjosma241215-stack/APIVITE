import mongoose from 'mongoose';

// Esquema principal para los gastos del dashboard financiero.
const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['normal', 'high'],
      default: 'normal'
    },
    icon: {
      type: String,
      default: 'bi-wallet2'
    }
  },
  {
    timestamps: true,
    collection: 'gastos'
  }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
