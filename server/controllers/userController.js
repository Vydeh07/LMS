import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import crypto from "crypto";
import razorpayInstance from "../configs/razorpay.js";

/**
 * Get User Data
 */
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("🚨 Get User Data Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get User Enrolled Courses with Lecture Links
 */
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }

        const userData = await User.findById(userId).populate("coursesEnrolled");
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, enrolledCourses: userData.coursesEnrolled });
    } catch (error) {
        console.error("🚨 Enrolled Courses Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Purchase Course (Create Razorpay Order)
 */
export const purchaseCourse = async (req, res) => {
    try {
        console.log("📥 Request Body:", req.body);

        const { courseId } = req.body;
        const userId = req.auth?.userId;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "courseId is required" });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.status(404).json({ success: false, message: "User or Course not found" });
        }

        // Ensure coursePrice is valid
        if (typeof courseData.coursePrice !== "number" || courseData.coursePrice <= 0) {
            return res.status(400).json({ success: false, message: "Invalid course price" });
        }

        // Ensure discount is valid
        const discount = courseData.discount || 0;
        const finalAmount = Math.round((courseData.coursePrice - (discount * courseData.coursePrice) / 100) * 100);

        if (finalAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid discounted price" });
        }

        // Razorpay Order Creation
        const options = {
            amount: finalAmount,
            currency: process.env.CURRENCY || "INR",
            receipt: `receipt_${crypto.randomBytes(10).toString("hex")}`,
            payment_capture: 1
        };

        console.log("🛒 Razorpay Order Payload:", options); // Debug log

        const order = await razorpayInstance.orders.create(options);
        if (!order) {
            return res.status(500).json({ success: false, message: "Order creation failed" });
        }

        res.json({
            success: true,
            orderId: order.id,
            amount: finalAmount,
            currency: process.env.CURRENCY || "INR",
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("🚨 Purchase Course Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

/**
 * Verify Payment and Enroll User in Course
 */
export const verifyPayment = async (req, res) => {
    try {
        console.log("📥 Payment Verification Body:", req.body);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amount } = req.body;
        const userId = req.auth?.userId;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }

        // Verify Razorpay Signature
        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // Mark purchase as successful
        await Purchase.create({
            userId,
            courseId,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount
        });

        // Add course to user's enrolled courses
        await User.findByIdAndUpdate(userId, { $addToSet: { coursesEnrolled: courseId } });

        res.json({ success: true, message: "Payment verified successfully, course enrolled!" });

    } catch (error) {
        console.error("🚨 Verify Payment Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
