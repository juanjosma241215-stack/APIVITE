// Respuesta estándar cuando la ruta no existe.
export const notFound = (_req, res, _next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
};

// Middleware global de errores para evitar respuestas HTML por defecto de Express.
export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
};
