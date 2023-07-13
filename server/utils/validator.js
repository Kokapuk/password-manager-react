import { body, oneOf, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({ message: 'Bad request', errors: errors.array() });
};

export const minLoginLength = 3;
export const maxLoginLength = 12;
export const minPasswordLength = 6;
export const maxPasswordLength = 32;

export const signInValidation = [
  body('login', `Login must be between ${minLoginLength} and ${maxLoginLength} characters`).isLength({
    min: minLoginLength,
    max: maxLoginLength,
  }),
  body('password', `Password must be between ${minPasswordLength} and ${maxPasswordLength} characters`).isLength({
    min: minPasswordLength,
    max: maxPasswordLength,
  }),
];

export const signUpValidation = [...signInValidation];

export const passwordValidation = [
  body('name', 'Invalid name').isLength({ min: 1, max: 64 }),
  // body('credentials', 'Invalid credentials').isObject(),
  // oneOf([body('credentials.fields').isArray(), body('credentials.integration').isString()], {
  //   message: 'Only one of these must be passed: fields, integration',
  // }),
  // oneOf([body('credentials.fields').isEmpty(), body('credentials.integration').isEmpty()], {
  //   message: 'Only one of these must be passed: fields, integration',
  // }),
  body('website', 'Invalid website').isURL(),
];
