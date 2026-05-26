import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"

import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

import { Otp } from "../models/otp.models.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) throw new ApiError(400, "Email is required");

    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) await Otp.deleteOne({ email });

    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.create({ email, otp });

    // Send email using nodemailer (or resend/ethereal)
    const transporter = nodemailer.createTransport({
        service: "gmail", // use your provider
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
        from: process.env.SMTP_EMAIL
    });

    await transporter.sendMail({
        from: `${process.env.SMTP_EMAIL}`,
        to: email,
        subject: "Your One-Time Password (OTP)",
        text: `Hello,
  
  Your OTP for MyApp is: ${otp}
  
  This code will expire in 5 minutes.
  
  If you did not request this, please ignore this email.
  
  Thank you,
  MyApp Team`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Your OTP for <strong>MyApp</strong> is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #2b6cb0;">${otp}</p>
        <p style="font-size: 14px; color: #555;">This code will expire in 5 minutes.</p>
        <p style="font-size: 14px; color: #555;">If you didn't request this, you can safely ignore this email.</p>
        <p style="margin-top: 30px; font-size: 14px;">Thanks,<br/>The MyApp Team</p>
      </div>
    `
    });


    res.status(200).json(new ApiResponse(200, {}, "OTP sent to email"));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) throw new ApiError(400, "Email and OTP required");

    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) throw new ApiError(404, "OTP not found or expired");

    if (existingOtp.otp !== otp) throw new ApiError(401, "Invalid OTP");

    if (existingOtp.expiresAt < new Date()) {
        await Otp.deleteOne({ email });
        throw new ApiError(410, "OTP expired");
    }

    await Otp.deleteOne({ email });

    res.status(200).json(new ApiResponse(200, { verified: true }, "OTP verified"));
});



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // ✅ Store as nested object
        user.refreshToken = {
            token: refreshToken,
            issuedAt: new Date()
        };

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { name, email, password } = req.body


    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ name }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }



    const user = await User.create({
        name,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie



    const { email, password } = req.body
    console.log("Email : ", email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: "lax"
    }
    res.cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: "lax"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    console.log("Cookies:", req.cookies);
    console.log("Body:", req.body);
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized");

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded?._id);
        console.log("Decoded Token Expiry:", new Date(decoded.exp * 1000)); // Convert to milliseconds

        if (!user) throw new ApiError(401, "User not found");

        console.log("Incoming Refresh Token:", incomingRefreshToken);
        console.log("Stored Refresh Token:", user.refreshToken?.token);

        const storedToken = user.refreshToken?.token;

        if (storedToken !== incomingRefreshToken) {
            await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: 1 } });
            throw new ApiError(401, "Token reuse detected or expired");
        }

        // All good → rotate token
        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = {
            token: newRefreshToken,
            issuedAt: new Date()
        };
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));

    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid token");
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("Email : ",email);
    console.log("Password : ",password);
    
    
    if (!email || !password) {
      throw new ApiError(400, "Email and new password are required");
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Update password (will hash due to pre-save hook)
    user.password = password;
  
    // Optional: Invalidate refresh tokens after password reset
    user.refreshToken = undefined;
  
    await user.save();
  
    res.status(200).json(
      new ApiResponse(200, {}, "Password has been successfully reset")
    );
  });
  

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body



    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res.department
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    sendOtp,
    verifyOtp,
    resetPassword
}