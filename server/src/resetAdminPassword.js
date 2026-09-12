import "dotenv/config";
import readline from "node:readline";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => {
    rl.question(question, resolve);
  });

const main = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      throw new Error("ADMIN_EMAIL is missing from server/.env");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error(`Admin user not found: ${email}`);
    }

    console.log("\nPrince Digital Studio - Admin Password Reset");
    console.log(`Admin: ${email}\n`);

    const newPassword = await ask("Enter new password: ");

    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must contain at least 8 characters.");
    }

    const confirmPassword = await ask("Confirm new password: ");

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    user.password = newPassword;
    await user.save();

    console.log("\n✓ Admin password updated successfully.");
    console.log("You can now login with the new password.\n");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Password update failed:");
    console.error(error.message);

    rl.close();
    process.exit(1);
  }
};

main();