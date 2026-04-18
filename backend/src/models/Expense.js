import mongoose from 'mongoose';

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
    },
    // VINCULACIÓN: Referencia al ID del usuario
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    // Forzamos el nombre de la colección que vimos en tu Atlas
    collection: 'gastos'
  }
);

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;