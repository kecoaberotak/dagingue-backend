import Joi from 'joi';
import { ContentType } from '../types/content.types';

export const createContentValidation = (payload: ContentType) => {
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
