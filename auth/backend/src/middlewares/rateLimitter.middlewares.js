// src/middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

// Global limiter: applies to ALL requests
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Route-specific limiters
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // max 5 OTPs per IP
  message: "Too many OTP requests. Please try again later.",
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 login attempts
  message: "Too many login attempts. Please try again later.",
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5,
  message: "Too many password reset attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

