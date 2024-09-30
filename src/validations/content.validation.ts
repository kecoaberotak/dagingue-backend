import Joi from 'joi';
import { AboutType } from '../types/content.types';

export const createContentValidation = (payload: AboutType) => {
  const schema = Joi.object({
    desc: Joi.string().required().messages({
      'any.required': 'Deskripsi tidak boleh kosong atau data tidak valid',
    }),
    image1: Joi.object({
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
        'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
        'any.required': 'File gambar wajib diunggah',
      }),
    })
      .unknown(true)
      .required()
      .messages({ 'object.base': 'File image tidak valid', 'any.required': 'File gambar wajib diunggah' }),
    image2: Joi.object({
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
        'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
        'any.required': 'File gambar wajib diunggah',
      }),
    })
      .unknown(true)
      .required()
      .messages({ 'object.base': 'File image tidak valid', 'any.required': 'File gambar wajib diunggah' }),
  });

  return schema.validate(payload);
};

export const updateContentValidation = (payload: AboutType) => {
  const schema = Joi.object({
    desc: Joi.string().optional().messages({
      'string.base': 'Deskripsi  tidak valid',
    }),
    image1: Joi.alternatives()
      .try(
        Joi.string().uri().optional(),
        Joi.object({
          mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
            'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
          }),
        })
          .unknown(true)
          .optional()
          .messages({ 'object.base': 'File image tidak valid' }),
      )
      .optional(),
    image2: Joi.alternatives()
      .try(
        Joi.string().uri().optional(),
        Joi.object({
          mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
            'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
          }),
        })
          .unknown(true)
          .optional()
          .messages({ 'object.base': 'File image tidak valid' }),
      )
      .optional(),
  });

  return schema.validate(payload);
};
