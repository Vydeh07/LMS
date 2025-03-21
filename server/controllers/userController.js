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
// update User Course Progress
export const updateUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId, lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId,courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true, message: "Course Completed"})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        } else{
            await CourseProgress.create({userId, courseId, lectureCompleted: [lectureId]})
        }
        res.json({success: true, message: "Course Progress Updated"})
    
    } catch (error) {
        console.error("��� Update User Course Progress Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    
    }
}
//get User Course Progress
export const getUserCourseProgress = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId}= req.body
        const progressData = await CourseProgress.findOne({userId, courseId})
        if(progressData){
            res.json({success: true, courseProgress: progressData})
        } else{
            res.json({success: false, message: "No Course Progress Found"})
        }
    } catch (error) {
        console.error("��� Get User Course Progress Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

//Add User Rating to Course

export const addUserRating = async(req,res) =>{
    const userId = req.auth.userId;
    const {courseId , rating} = req.body;

    if(!courseId || !userId || !rating||rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Invalid courseId, userId, or rating" });
    }
    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        const user = await User.findById(userId);

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({ success: false, message: "User not purchased course"});
        }

        const existingRatingIndex = course.courseRatings.findIndex(r=> r.userId === userId)
        if(existingRatingIndex > -1){
            course.courseRating[existingRatingIndex].rating = rating;

        }else{
            course.courseRatings.push({userId, rating})
        }
        await course.save();
        return res.json({success:true,message:'Rating added'})
    } catch (error) {
        return res.json({success:false, message:error.message})
        
    }
}