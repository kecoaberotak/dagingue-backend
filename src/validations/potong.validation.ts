import Joi from 'joi';
import { PotongType } from '../types/potong.type';

export const createPotongValidation = (payload: PotongType) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    // Joi.alternatives() ??
    image: Joi.string().required().messages({
      'any.required': 'Gambar harus diupload',
    }),
  });

  return schema.validate(payload);
};
