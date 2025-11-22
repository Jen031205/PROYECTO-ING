const Joi = require("joi");

const permisoSchema = Joi.object({
  tipo: Joi.string().valid("temporal", "economico", "cumpleaños").required(),
  motivo: Joi.string().optional(),
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required(),
  empleado_id: Joi.number().required(),
});

module.exports = permisoSchema