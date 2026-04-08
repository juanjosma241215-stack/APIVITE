import Task from '../models/Task.js';

// Devuelve todas las tareas ordenadas por fecha de creación descendente.
export const getTasks = async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
};

// Crea una nueva tarea validando el título mínimo requerido.
export const createTask = async (req, res) => {
  const { title, description, completed } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: 'El titulo es obligatorio' });
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || '',
    completed: Boolean(completed)
  });

  return res.status(201).json(task);
};

// Actualiza parcialmente una tarea existente.
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ message: 'El titulo no puede estar vacio' });
    }

    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description.trim();
  }

  if (completed !== undefined) {
    task.completed = Boolean(completed);
  }

  await task.save();
  return res.json(task);
};

// Elimina una tarea por id.
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  await task.deleteOne();
  return res.json({ message: 'Tarea eliminada' });
};
