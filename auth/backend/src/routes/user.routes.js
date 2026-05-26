import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  sendOtp,
  verifyOtp,
  resetPassword
} from "../controllers/user.controllers.js";

import { validate } from "../middlewares/validate.middlewares.js";
import {
  loginValidator,
  registerValidator,
  sendOtpValidator,
  verifyOtpValidator,
  resetPasswordValidator
} from "../validators/auth.validators.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { otpLimiter, loginLimiter, resetPasswordLimiter } from "../middlewares/rateLimitter.middlewares.js";

const router = Router();

router.route("/register").post(registerValidator, validate, registerUser);
router.route("/login").post(loginLimiter, loginValidator, validate, loginUser); // 👈 login limiter
router.route("/send-otp").post(otpLimiter, sendOtpValidator, validate, sendOtp); // 👈 OTP limiter
router.route("/verify-otp").post(verifyOtpValidator, validate, verifyOtp);
router.route("/reset-password").post(resetPasswordLimiter,resetPasswordValidator,validate,resetPassword);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/protected-route").get(verifyJWT, (req, res) => res.status(200).json());

export default router;
