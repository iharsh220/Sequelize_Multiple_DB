const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createDatabase, getSequelizeInstance } = require("../config/database");
const SubscriptionModel = require("../models/subscription");
const UserModel = require("../models/user");

const registerCompany = async (req, res) => {
    const { companyId, plan, validUntil, adminEmail, adminPassword } = req.body;

    if (!companyId || !plan || !validUntil || !adminEmail || !adminPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Create a new database for the company
        await createDatabase(companyId);

        // Initialize Sequelize for the company's database
        const sequelize = getSequelizeInstance(companyId);

        // Define the models in the new database
        const Subscription = SubscriptionModel(sequelize);
        const User = UserModel(sequelize);

        // Sync models to create tables
        await sequelize.sync();

        // Hash the admin password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create the subscription record
        await Subscription.create({
            companyId,
            plan,
            validUntil,
        });

        // Create the admin user
        await User.create({
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            companyId,
        });

        res.status(201).json({ message: "Company registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering company" });
    }
};

const loginCompany = async (req, res) => {
    const { companyId, email, password } = req.body;

    if (!companyId || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Connect to the company's database
        const sequelize = getSequelizeInstance(companyId);

        // Define the User model in the company's database
        const User = UserModel(sequelize);

        // Find the user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ companyId, userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};

module.exports = { registerCompany, loginCompany };
