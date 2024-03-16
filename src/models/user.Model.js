const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z]+$/.test(value),
      message: "First name must contain only letters (alphabetic characters)",
    },
    minlength: [2, "name at least contain 2 letter"],
    maxlength: [32, "limit exceeded"],
  },

  lastName: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z]+$/.test(value),
      message: "Last name must contain only letters (alphabetic characters)",
    },
    minlength: [2, "title at least contain 2 letter"],
    maxlength: [32, "limit exceeded"],
  },

  dist: {
    type: String,
    enum: ["Tamulpur", "Baksa", "Kokrajhar", "Udalguri", "Chirang"],
  },

  fatherName: {
    type: String,
    // validate: {
    // validator: (value) => /^[a-zA-Z]+$/.test(value),
    // message: "First name must contain only letters (alphabetic characters)",
    // },
    minlength: [2, "title at least contain 2 letter"],
    maxlength: [32, "limit exceeded"],
  },

  profileImage: {
    type: String,
  },

  email: {
    type: String,
    sparse: true, // Allows multiple documents to have null value for this field
    required: function () {
      return !this.phone;
    },
    validate: {
      validator: function (v) {
        return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },

  password: {
    type: String,
    required: true,
    minlength: [7, `Password must be at least 7 characters long.`],
  },

  phone: {
    // type: Number,
    sparse: true,
    type: String,
    required: function () {
      return !this.email;
    },
    unique: false,
  },

  randomToken: {
    type: String,
  },

  userType: {
    type: String,
    enum: ["user", "joined", "member", "post-admin", "admin", "superAdmin"],
    default: "user",
  },

  joined: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Join",
  },

  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DistrictMember",
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  po: {
    type: String,
  },

  ps: {
    type: String,
  },

  gender: {
    type: String,
    enum: ["male", "female"],
  },

  otp: {
    type: String,
  },

  otpExpiration: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["active", "deleting"],
    default: "active",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Check if the document is new
    // Check if both email and phone are provided
    if (this.email && this.phone) {
      throw new Error("Provide either email or phone, but not both");
    }
    // Check if neither email nor phone is provided
    if (!this.email && !this.phone) {
      throw new Error("Provide either email or phone");
    }
  }
  next();
});
//method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // If password is not modified, move to the next middleware
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
