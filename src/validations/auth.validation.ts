import Joi from 'joi';
import { LoginTypes, RegisterTypes } from '../types/auth.types';

export const registerValidation = (payload: RegisterTypes) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Nama tidak boleh kosong atau data tidak valid',
    }),
    email: Joi.string().required().messages({
      'any.required': 'Email tidak boleh kosong atau data tidak valid',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password tidak boleh kosong atau data tidak valid',
    }),
  });

  return schema.validate(payload);
};

export const loginValidation = (payload: LoginTypes) => {
  const schema = Joi.object({
    email: Joi.string().required().messages({
      'any.required': 'Email tidak boleh kosong atau data tidak valid',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password tidak boleh kosong atau data tidak valid',
    }),
  });

  return schema.validate(payload);
};
