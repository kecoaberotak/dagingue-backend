import Joi from 'joi';
import { ProductType } from '../types/product.type';

export const createProductValidation = (payload: ProductType) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Nama tidak boleh kosong atau data tidak valid',
    }),
    desc: Joi.string().required().messages({
      'any.required': 'Deskripsi tidak boleh kosong atau data tidak valid',
    }),
    price: Joi.number().required().messages({
      'any.required': 'Harga tidak boleh kosong atau data tidak valid',
    }),
    image: Joi.object({
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
        'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
        'any.required': 'File gambar wajib diunggah',
      }),
    })
      .unknown(true) // Mengizinkan properti lain dari Multer
      .required()
      .messages({ 'object.base': 'File image tidak valid', 'any.required': 'File gambar wajib diunggah' }),
  });

  return schema.validate(payload);
};

export const updateProductValidation = (payload: ProductType) => {
  const schema = Joi.object({
    name: Joi.string().optional().messages({
      'string.base': 'Nama tidak valid',
    }),
    desc: Joi.string().optional().messages({
      'string.base': 'Deskripsi  tidak valid',
    }),
    price: Joi.number().optional().messages({
      'number.base': 'Harga tidak valid',
    }),
    image: Joi.alternatives()
      .try(
        Joi.string().uri().optional(), // Untuk link gambar yang sudah ada
        Joi.object({
          mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
            'any.only': 'File harus berupa gambar dengan format jpeg, png, atau gif',
          }),
        })
          .unknown(true)
          .optional()
          .messages({ 'object.base': 'File image tidak valid' }),
      )
      .optional(), // Seluruh image bisa opsional,
  });

  return schema.validate(payload);
};
