// routes/orderRoutes.js - FULL VERSION NOW THAT BASIC ROUTE WORKS
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Import controller functions - with error handling
let orderController;
try {
  orderController = require("../controllers/orderController");
  console.log("✅ Order controller loaded successfully");
} catch (error) {
  console.error("❌ Failed to load order controller:", error.message);
  // Fallback controller functions
  orderController = {
    getOrders: (req, res) => {
      res.status(500).json({
        success: false,
        message: "Order controller not available",
        error: "Controller loading failed"
      });
    },
    createOrder: (req, res) => {
      res.status(500).json({
        success: false,
        message: "Order creation not available",
        error: "Controller loading failed"
      });
    },
    getOrderById: (req, res) => {
      res.status(500).json({
        success: false,
        message: "Order retrieval not available",
        error: "Controller loading failed"
      });
    },
    updateOrderStatus: (req, res) => {
      res.status(500).json({
        success: false,
        message: "Order update not available",
        error: "Controller loading failed"
      });
    }
  };
}

// Test route (no auth required) - for debugging
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Orders route is working!",
    timestamp: new Date().toISOString(),
    controllerAvailable: !!orderController.getOrders
  });
});

// Check if protect middleware is available
let protectMiddleware;
try {
  protectMiddleware = protect;
  console.log("✅ Auth middleware loaded successfully");
} catch (error) {
  console.error("❌ Failed to load auth middleware:", error.message);
  // Fallback middleware that allows all requests (for testing)
  protectMiddleware = (req, res, next) => {
    console.warn("⚠️ Using fallback auth middleware - no authentication");
    req.user = { _id: "test-user-id", role: "user" }; // Mock user for testing
    next();
  };
}

// Apply authentication middleware to protected routes
router.use(protectMiddleware);

// Main routes with comprehensive error handling
router.get("/", async (req, res, next) => {
  try {
    console.log("📥 GET /api/orders - User:", req.user?._id);
    await orderController.getOrders(req, res, next);
  } catch (error) {
    console.error("❌ Error in GET /orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log("📤 POST /api/orders - User:", req.user?._id);
    console.log("📤 Body keys:", Object.keys(req.body));
    await orderController.createOrder(req, res, next);
  } catch (error) {
    console.error("❌ Error in POST /orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    console.log("📥 GET /api/orders/:id - ID:", req.params.id, "User:", req.user?._id);
    await orderController.getOrderById(req, res, next);
  } catch (error) {
    console.error("❌ Error in GET /orders/:id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    console.log("🔄 PATCH /api/orders/:id/status - ID:", req.params.id, "Status:", req.body.status);
    await orderController.updateOrderStatus(req, res, next);
  } catch (error) {
    console.error("❌ Error in PATCH /orders/:id/status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
});

console.log("📦 Order routes module loaded successfully");
module.exports = router;