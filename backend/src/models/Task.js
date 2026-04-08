import mongoose from 'mongoose';

// Esquema base para las tareas del CRUD.
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    // Agrega createdAt y updatedAt automáticamente.
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
