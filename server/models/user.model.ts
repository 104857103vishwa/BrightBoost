require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: {
    public_id: string;
    url: string;
  };
  address: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  sessions: Array<{ sessionId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    profileImage: {
      public_id: String,
      url: String,
    },
    address: {
      type: String,
      required: [true, "Please enter your address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone Number"],
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    sessions: [
      {
        sessionId: String,
      },
    ],
  },
  { timestamps: true }
);

//encrypt Password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// compare Password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};


const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;

