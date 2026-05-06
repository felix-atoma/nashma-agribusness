// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price cannot be negative"],
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],
    shippingAddress: {
      firstName: { 
        type: String, 
        required: [true, "First name is required"], 
        trim: true 
      },
      lastName: { 
        type: String, 
        required: [true, "Last name is required"], 
        trim: true 
      },
      email: { 
        type: String, 
        required: [true, "Email is required"], 
        trim: true, 
        lowercase: true 
      },
      phone: { 
        type: String, 
        required: [true, "Phone number is required"], 
        trim: true 
      },
      address: { 
        type: String, 
        required: [true, "Address is required"], 
        trim: true 
      },
      city: { 
        type: String, 
        required: [true, "City is required"], 
        trim: true 
      },
      state: { 
        type: String, 
        required: [true, "State is required"], 
        trim: true 
      },
      zipCode: { 
        type: String, 
        required: [true, "Zip code is required"], 
        trim: true 
      },
      country: { 
        type: String, 
        required: [true, "Country is required"], 
        trim: true, 
        default: "Ghana" 
      },
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["cod", "momo", "card"],
        message: "Payment method must be either cod, momo, or card",
      },
      default: "cod",
    },

    // Mobile Money details
    momoDetails: {
      network: {
        type: String,
        enum: ["mtn", "vodafone", "airteltigo"],
        required: function () {
          return this.paymentMethod === "momo";
        },
      },
      phoneNumber: {
        type: String,
        trim: true,
        required: function () {
          return this.paymentMethod === "momo";
        },
      },
      transactionId: { 
        type: String, 
        trim: true,
        sparse: true
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed", "cancelled"],
        default: "pending",
      },
    },

    // Paystack details
    paystackDetails: {
      reference: { 
        type: String, 
        trim: true,
        sparse: true // Allows null values but maintains uniqueness for non-null
      },
      accessCode: { 
        type: String, 
        trim: true 
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed", "abandoned"],
        default: "pending",
      },
    },

    mobileNumber: { 
      type: String, 
      trim: true 
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
      min: [0, "Total cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "shipped", "completed", "cancelled"],
        message: "Status must be one of: pending, paid, shipped, completed, cancelled",
      },
      default: "pending",
    },
    isPaid: { 
      type: Boolean, 
      default: false 
    },
    paidAt: { 
      type: Date 
    },
    isDelivered: { 
      type: Boolean, 
      default: false 
    },
    deliveredAt: { 
      type: Date 
    },
    trackingNumber: { 
      type: String, 
      trim: true 
    },
    notes: { 
      type: String, 
      trim: true 
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "items.product": 1 });
orderSchema.index({ "momoDetails.transactionId": 1 });
orderSchema.index({ "paystackDetails.reference": 1 });

// Virtual for order ID display
orderSchema.virtual("orderNumber").get(function () {
  return this._id.toString().slice(-8).toUpperCase();
});

// Virtual for payment status display
orderSchema.virtual("paymentStatusDisplay").get(function () {
  if (this.paymentMethod === "momo") {
    return this.momoDetails.paymentStatus;
  }
  if (this.paymentMethod === "card") {
    return this.paystackDetails.paymentStatus;
  }
  return this.isPaid ? "paid" : "pending";
});

// Pre-save middleware to update timestamps based on status
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "paid" && !this.isPaid) {
      this.isPaid = true;
      this.paidAt = new Date();
    }
    if (this.status === "completed" && !this.isDelivered) {
      this.isDelivered = true;
      this.deliveredAt = new Date();
    }
  }

  // Update payment status for momo orders
  if (this.paymentMethod === "momo" && this.isModified("momoDetails.paymentStatus")) {
    if (this.momoDetails.paymentStatus === "success" && !this.isPaid) {
      this.isPaid = true;
      this.paidAt = new Date();
      this.status = "paid";
    } else if (this.momoDetails.paymentStatus === "failed" && this.isPaid) {
      this.isPaid = false;
      this.paidAt = undefined;
      this.status = "pending";
    }
  }

  // Update payment status for Paystack orders
  if (this.paymentMethod === "card" && this.isModified("paystackDetails.paymentStatus")) {
    if (this.paystackDetails.paymentStatus === "success" && !this.isPaid) {
      this.isPaid = true;
      this.paidAt = new Date();
      this.status = "paid";
    } else if (["failed", "abandoned"].includes(this.paystackDetails.paymentStatus) && this.isPaid) {
      this.isPaid = false;
      this.paidAt = undefined;
      this.status = "pending";
    }
  }

  next();
});

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$total" },
      },
    },
  ]);
  return stats;
};

// Instance method to calculate order total
orderSchema.methods.calculateTotal = function () {
  this.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  this.total = this.subtotal; // Add shipping, tax, etc. here if needed
  return this.total;
};

module.exports = mongoose.model("Order", orderSchema);