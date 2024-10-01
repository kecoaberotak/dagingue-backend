import Joi from 'joi';
import { AboutType, MediaType } from '../types/content.types';

export const createAboutValidation = (payload: AboutType) => {
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

export const updateAboutValidation = (payload: AboutType) => {
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

export const createMediaValidation = (payload: MediaType) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email tidak boleh kosong atau data tidak valid',
    }),
    phone: Joi.number().required().messages({
      'any.required': 'Nomor telepon tidak boleh kosong atau data tidak valid',
    }),
    address: Joi.string().required().messages({
      'any.required': 'Alamat tidak boleh kosong atau data tidak valid',
    }),
    instagram: Joi.string().uri().required().messages({
      'any.required': 'Akun Instagram tidak boleh kosong atau data tidak valid',
    }),
    shopee: Joi.string().uri().required().messages({
      'any.required': 'Akun Shopee tidak boleh kosong atau data tidak valid',
    }),
    whatsapp: Joi.string().uri().required().messages({
      'any.required': 'Akun Whatsapp tidak boleh kosong atau data tidak valid',
    }),
    maps: Joi.string().uri().required().messages({
      'any.required': 'Alamat Google Maps tidak boleh kosong atau data tidak valid',
    }),
    logo_image: Joi.object({
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
        'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
        'any.required': 'File gambar wajib diunggah',
      }),
    })
      .unknown(true)
      .required()
      .messages({ 'object.base': 'File image tidak valid', 'any.required': 'File gambar wajib diunggah' }),
    hero_image: Joi.object({
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
        'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
        'any.required': 'File gambar wajib diunggah',
      }),
    })
      .unknown(true)
      .required()
      .messages({ 'object.base': 'File image tidak valid', 'any.required': 'File gambar wajib diunggah' }),
    background_image: Joi.object({
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
        'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
        'any.required': 'File gambar wajib diunggah',
      }),
    })
      .unknown(true)
      .required()
      .messages({ 'object.base': 'File image tidak valid', 'any.required': 'File gambar wajib diunggah' }),
    footer_image: Joi.object({
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
