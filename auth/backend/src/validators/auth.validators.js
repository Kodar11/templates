// src/validators/auth.validators.js
import { body } from "express-validator";

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),

  body('email')
    .isEmail().withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginValidator = [
  body('email')
    .isEmail().withMessage('Valid email is required'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

export const sendOtpValidator = [
    body("email")
      .isEmail().withMessage("A valid email is required")
      .normalizeEmail()
  ];
  
  export const verifyOtpValidator = [
    body("email")
      .isEmail().withMessage("A valid email is required")
      .normalizeEmail(),
    body("otp")
      .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
      .isNumeric().withMessage("OTP must be numeric")
  ];

  export const resetPasswordValidator = [
    body("email")
      .isEmail().withMessage("Valid email is required")
      .normalizeEmail(),
  
    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ];
  