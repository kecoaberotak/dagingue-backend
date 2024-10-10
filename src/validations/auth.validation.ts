import Joi from 'joi';
import { LoginTypes, RegisterTypes } from '../types/auth.types';

export const registerValidation = (payload: RegisterTypes) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Nama tidak boleh kosong atau data tidak valid',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email tidak boleh kosong atau data tidak valid',
      'string.email': 'Format email tidak valid',
    }),
    password: Joi.string().min(6).required().messages({
      'any.required': 'Password tidak boleh kosong atau data tidak valid',
      'string.min': 'Password minimal harus 6 karakter',
    }),
  });

  return schema.validate(payload);
};

export const updateUserValidation = (payload: RegisterTypes) => {
  const schema = Joi.object({
    name: Joi.string().optional().messages({
      'string.base': 'Nama tidak valid',
    }),
    email: Joi.string().email().optional().messages({
      'string.base': 'email tidak valid',
      'string.email': 'Format email tidak valid',
    }),
    password: Joi.string().min(6).optional().messages({
      'string.base': 'password tidak valid',
      'string.min': 'Password minimal harus 6 karakter',
    }),
  });

  return schema.validate(payload);
};

export const loginValidation = (payload: LoginTypes) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email tidak boleh kosong atau data tidak valid',
      'string.email': 'Format email tidak valid',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password tidak boleh kosong atau data tidak valid',
    }),
  });

  return schema.validate(payload);
};
