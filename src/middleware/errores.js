export function enviarError(res, status, mensaje, detalles = undefined) {
  const cuerpo = { error: mensaje };

  if (detalles !== undefined) {
    cuerpo.detalles = detalles;
  }

  return res.status(status).json(cuerpo);
}

export function manejarErroresZod(res, resultado) {
  return enviarError(res, 400, 'Solicitud invalida', resultado.error.flatten());
}

export function rutaNoEncontrada(req, res) {
  return enviarError(res, 404, `Ruta no encontrada: ${req.method} ${req.path}`);
}
