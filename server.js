const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use(express.static(__dirname));

// ==========================================
// EMAIL SETUP
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chilukurisashidhar40@gmail.com', 
        pass: 'process.env.EMAIL_PASS'   // ⚠️ YOU MUST REPLACE THIS!
    }
});

// ==========================================
// DATABASE SETUP
// ==========================================
const mongoURI = "process.env.MONGO_URI"; 

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Swiggy Database Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// ==========================================
// 1. SCHEMAS & MODELS
// ==========================================

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    rating: Number,
    deliveryTime: String
});
const Food = mongoose.model('FoodItem', foodSchema);

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    resetOtp: String // Added for the OTP feature
});
const User = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
    email: String,
    items: Array,
    totalAmount: Number,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// 2. API ROUTES
// ==========================================

// --- Menu Routes ---
app.get('/api/menu', async (req, res) => {
    try {
        const menu = await Food.find();
        res.json(menu);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/menu/add', async (req, res) => {
    try {
        const newItem = new Food(req.body);
        await newItem.save();
        res.status(201).json({ message: "Food item added!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE: Remove a food item from the database
// DELETE: Remove a food item from the database
app.delete('/api/menu/:id', async (req, res) => {
    try {
        // 1. Check if the server even received the request
        console.log("➡️ Received request to delete ID:", req.params.id);

        // 2. Attempt to delete
        const deletedItem = await Food.findByIdAndDelete(req.params.id);

        // 3. Check if it actually found the item in the database
        if (!deletedItem) {
            console.log("❌ ERROR: Could not find that ID in the database!");
            return res.status(404).json({ error: "Item not found" });
        }

        // 4. Success!
        console.log("✅ Successfully deleted:", deletedItem.name);
        res.json({ message: "Food item deleted successfully!" });

    } catch (err) {
        console.log("❌ SERVER ERROR:", err);
        res.status(500).json({ error: "Failed to delete item" });
    }
});
// UPDATE: Change the image of a food item
app.put('/api/menu/:id/image', async (req, res) => {
    try {
        const { newImage } = req.body;
        
        // Find the item by ID and update just its image field
        const updatedItem = await Food.findByIdAndUpdate(
            req.params.id, 
            { image: newImage }, 
            { new: true } // This tells Mongoose to return the updated version
        );

        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        console.log(`✅ Image updated for: ${updatedItem.name}`);
        res.json({ message: "Image updated successfully!" });

    } catch (err) {
        console.log("❌ Error updating image:", err);
        res.status(500).json({ error: "Failed to update image" });
    }
});
// UPDATE: Change the price of a food item
app.put('/api/menu/:id/price', async (req, res) => {
    try {
        const { newPrice } = req.body;
        
        // We make sure the new price is actually a number!
        const numericPrice = Number(newPrice);
        if (isNaN(numericPrice)) {
            return res.status(400).json({ error: "Price must be a valid number" });
        }

        const updatedItem = await Food.findByIdAndUpdate(
            req.params.id, 
            { price: numericPrice }, 
            { new: true } 
        );

        if (!updatedItem) return res.status(404).json({ error: "Item not found" });

        console.log(`✅ Price updated for: ${updatedItem.name} to ₹${updatedItem.price}`);
        res.json({ message: "Price updated successfully!" });

    } catch (err) {
        console.log("❌ Error updating price:", err);
        res.status(500).json({ error: "Failed to update price" });
    }
});


// --- Auth Routes ---
app.post('/api/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.log("Signup Error Details:", err);
        res.status(500).json({ error: "Database error or email exists" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); 
        if (user) {
            res.json(user); 
        } else {
            res.status(401).json({ error: "Invalid email or password!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// --- Forgot Password OTP Routes ---
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Email not found!" });

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Save OTP to DB
        user.resetOtp = otp;
        await user.save();

        // Send Email
        const mailOptions = {
            from: 'FoodFlow App',
            to: email,
            subject: 'Your FoodFlow Password Reset OTP',
            text: `Your OTP for resetting your password is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully!" });
    } catch (err) {
        console.log("Email error:", err);
        res.status(500).json({ error: "Failed to send email. Check your App Password." });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, resetOtp: otp });
        if (!user) return res.status(400).json({ error: "Invalid OTP or Email!" });

        // Update password & clear OTP
        user.password = newPassword;
        user.resetOtp = undefined; 
        await user.save();

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// --- Order Routes ---
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order saved successfully!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- ADMIN ROUTE: Fetch ALL Orders ---
app.get('/api/admin/orders', async (req, res) => {
    try {
        // .find() gets everything, .sort({ date: -1 }) puts the newest orders at the top!
        const allOrders = await Order.find().sort({ date: -1 });
        res.json(allOrders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

app.get('/api/my-orders/:email', async (req, res) => {
    try {
        const userOrders = await Order.find({ email: req.params.email });
        res.json(userOrders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- ADMIN ROUTE: Update Order Status ---
// --- ADMIN ROUTE: Update Order Status ---
app.put('/api/admin/orders/:id/status', async (req, res) => {
    try {
        console.log(`➡️ Received request to update order ${req.params.id} to ${req.body.status}`);
        
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: status }, { new: true });
        
        if (!updatedOrder) {
            console.log("❌ Error: Order not found in database!");
            return res.status(404).json({ error: "Order not found" });
        }

        console.log("✅ Order updated successfully!");
        res.json({ message: "Order status updated successfully!" });
    } catch (err) {
        console.log("❌ Server Error details:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

// --- UPDATE USER PROFILE ROUTES ---

// 1. Update Name
app.put('/api/user/name', async (req, res) => {
    const { email, newName } = req.body;
    try {
        // Find user by email and update their name
        const user = await User.findOneAndUpdate({ email: email }, { name: newName }, { new: true });
        if (user) {
            res.json({ message: "Name updated successfully!" });
        } else {
            res.status(404).json({ error: "User not found!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// 2. Update Password
app.put('/api/user/password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    try {
        // First, check if the old password is correct
        const user = await User.findOne({ email: email, password: currentPassword });
        
        if (!user) {
            return res.status(401).json({ error: "Incorrect current password!" });
        }

        // If correct, save the new password
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password updated successfully!" });

    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});
// ==========================================
// SERVE FRONTEND (This fixes "Cannot GET /")
// ==========================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// START SERVER
// ==========================================
// 👈 Changed this!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

