// ======================================================
// IMPORTS
// ======================================================

const dns = require("dns");
const https = require("https");
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const vehicleRoutes = require("./routes/vehicleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const sellRequestRoutes = require("./routes/sellRequestRoutes");
const { ensureCategoryBrandSeed } = require("./utils/categoryBrandSeed");
const { ensureConfiguredAdmin } = require("./utils/adminUserSeed");
const {
  isLocalDevelopmentOrigin,
  requireAdmin,
} = require("./middleware/requireAdmin");

// ======================================================
// ENVIRONMENT
// ======================================================

dotenv.config({ path: path.join(__dirname, ".env") });

if (process.env.NODE_ENV !== "production") {
  const smtpVariables = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "MAIL_FROM",
    "FRONTEND_URL",
  ];
  console.info(
    "Password-reset configuration loaded:",
    Object.fromEntries(
      smtpVariables.map((name) => [name, Boolean(process.env[name]?.trim())])
    )
  );
}

// MongoDB SRV DNS workaround
dns.setServers(["8.8.8.8"]);

// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

const configuredFrontendOrigin = (() => {
  try {
    return process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : "";
  } catch {
    return "";
  }
})();
const secureProductionFrontend =
  process.env.NODE_ENV !== "production" ||
  (process.env.FRONTEND_URL || "").startsWith("https://");
if (!secureProductionFrontend) {
  console.error("Production frontend configuration must use an HTTPS FRONTEND_URL.");
}

app.use(
  cors({
    origin(origin, callback) {
      const allowed =
        !origin ||
        (secureProductionFrontend && origin === configuredFrontendOrigin) ||
        isLocalDevelopmentOrigin(origin);
      callback(null, allowed);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await ensureCategoryBrandSeed();
    await ensureConfiguredAdmin();
    console.log("========================================");
    console.log("MongoDB connected successfully");
    console.log("========================================");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });

// ======================================================
// CLOUDINARY CONFIGURATION
// ======================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const originalHttpsRequest = https.request;
    let responseBodyPromise = Promise.resolve("");

    https.request = function (options, callback) {
      const isCloudinaryUpload =
        options &&
        typeof options === "object" &&
        /\/image\/upload(?:\?|$)/.test(options.path || "");

      if (!isCloudinaryUpload || typeof callback !== "function") {
        return originalHttpsRequest.call(this, options, callback);
      }

      return originalHttpsRequest.call(this, options, (response) => {
        let responseBody = "";
        responseBodyPromise = new Promise((resolveBody) => {
          response.on("data", (chunk) => {
            if (responseBody.length < 16384) {
              responseBody += chunk.toString().slice(0, 16384 - responseBody.length);
            }
          });
          response.on("end", () => resolveBody(responseBody));
          response.on("error", () => resolveBody(responseBody));
        });
        callback(response);
      });
    };

    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "jai-janardan-auto/vehicles",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            responseBodyPromise.then((responseBody) => {
              try {
                error.cloudinaryResponse = JSON.parse(responseBody);
              } catch {
                error.cloudinaryResponse = responseBody || undefined;
              }
              console.error("CLOUDINARY ACTUAL ERROR");
              console.error("message:", error.message);
              console.error("http_code:", error.http_code);
              console.error("name:", error.name);
              console.error("response body:", error.cloudinaryResponse);
              console.error("error:", error);
              reject(error);
            });
            return;
          }

          resolve(result);
        }
      );
      https.request = originalHttpsRequest;
      stream.end(buffer);
    } catch (error) {
      https.request = originalHttpsRequest;
      reject(error);
    }
  });

// ======================================================
// MULTER CONFIGURATION
// ======================================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per image
    files: 8, // Maximum 8 images
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const uploadMultiple = (req, res, next) => {
  const safeHeaders = Object.fromEntries(
    Object.entries(req.headers).map(([name, value]) => [
      name,
      /authorization|cookie|token|secret|api[-_]?key/i.test(name)
        ? "[REDACTED]"
        : value,
    ])
  );

  console.log("\n========================================");
  console.log("UPLOAD-MULTIPLE REQUEST STARTED");
  console.log("========================================");
  console.log("REQUEST RECEIVED");
  console.log("Request headers:", safeHeaders);

  upload.array("images", 8)(req, res, (error) => {
    if (error) {
      console.error("MULTER FAILED");
      console.error("message:", error.message);
      console.error("name:", error.name);
      console.error("code:", error.code);
      return next(error);
    }

    console.log("MULTER COMPLETED");
    const files = req.files || [];
    console.log("Number of files:", files.length);
    console.log(
      "Files:",
      files.map(({ originalname, mimetype, size }) => ({
        filename: originalname,
        mimetype,
        size,
      }))
    );
    next();
  });
};

// ======================================================
// ROOT API
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Jai Janardan Auto API is running",
  });
});

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    server: "running",
    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// ======================================================
// CLOUDINARY CONNECTION TEST
// GET /api/cloudinary/test
// ======================================================

app.get("/api/cloudinary/test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary ping successful");

    return res.status(200).json({
      success: true,
      message: "Cloudinary connected successfully",
      result,
    });
  } catch (error) {
    console.error("========================================");
    console.error("CLOUDINARY CONNECTION ERROR");
    console.error("========================================");
    console.error("Message:", error.message);
    console.error("HTTP Code:", error.http_code);
    console.error("Name:", error.name);
    console.error("Full Error:", error);
    console.error("========================================");

    return res.status(500).json({
      success: false,
      message: "Cloudinary connection failed",
      error: error.message,
    });
  }
});

// ======================================================
// SINGLE IMAGE UPLOAD
// POST /api/upload
// field name: image
// ======================================================

app.post(
  "/api/upload",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("\n========================================");
      console.log("SINGLE IMAGE UPLOAD");
      console.log("========================================");

      // Check file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image",
        });
      }

      console.log("File:", req.file.originalname);
      console.log("Type:", req.file.mimetype);
      console.log("Size:", req.file.size);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "jai-janardan-auto/vehicles",
            resource_type: "image",
            use_filename: true,
            unique_filename: true,
          },

          (error, result) => {
            if (error) {
              console.error("\n******** CLOUDINARY ERROR ********");
              console.error("Message:", error.message);
              console.error("HTTP Code:", error.http_code);
              console.error("Name:", error.name);
              console.error("Full Error:", error);
              console.error("*********************************\n");

              reject(error);
              return;
            }

            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      console.log("Upload successful:", result.secure_url);
      console.log("========================================\n");

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("\n========================================");
      console.error("SINGLE IMAGE UPLOAD FAILED");
      console.error("========================================");
      console.error("Message:", error.message);
      console.error("HTTP Code:", error.http_code);
      console.error("Name:", error.name);
      console.error("Full Error:", error);
      console.error("========================================\n");

      return res.status(500).json({
        success: false,
        message:
          error.message || "Image upload failed",
        errorCode:
          error.http_code || "UPLOAD_ERROR",
      });
    }
  }
);

// ======================================================
// MULTIPLE IMAGE UPLOAD
// POST /api/upload-multiple
// field name: images
// Maximum: 8 images
// ======================================================

app.post(
  ["/api/upload-multiple", "/api/admin/upload-multiple"],
  (req, res, next) =>
    req.path === "/api/admin/upload-multiple"
      ? requireAdmin(req, res, next)
      : next(),
  uploadMultiple,

  async (req, res) => {
    try {
      // --------------------------------------------------
      // CHECK FILES
      // --------------------------------------------------

      if (!req.files || req.files.length === 0) {
        console.error("No files received after Multer completed");

        return res.status(400).json({
          success: false,
          message: "Please select at least one image",
        });
      }

      console.log("FILE BUFFER AVAILABLE");
      console.log("Number of files:", req.files.length);

      // --------------------------------------------------
      // CHECK CLOUDINARY CONFIG
      // --------------------------------------------------

      const cloudinaryConfigStatus = {
        cloudNameConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
        apiKeyConfigured: Boolean(process.env.CLOUDINARY_API_KEY),
        apiSecretConfigured: Boolean(process.env.CLOUDINARY_API_SECRET),
      };

      console.log("Cloudinary cloud name configured:", cloudinaryConfigStatus.cloudNameConfigured);
      console.log("Cloudinary API key configured:", cloudinaryConfigStatus.apiKeyConfigured);
      console.log("Cloudinary API secret configured:", cloudinaryConfigStatus.apiSecretConfigured);

      if (
        !cloudinaryConfigStatus.cloudNameConfigured ||
        !cloudinaryConfigStatus.apiKeyConfigured ||
        !cloudinaryConfigStatus.apiSecretConfigured
      ) {
        console.error(
          "Cloudinary environment variables are missing"
        );

        return res.status(500).json({
          success: false,
          message:
            "Cloudinary configuration is missing in backend .env",
        });
      }

      // --------------------------------------------------
      // Upload each file with server-side Cloudinary credentials.
      // --------------------------------------------------

      const uploadedImages = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        console.log(`CLOUDINARY UPLOAD STARTED (${i + 1}/${req.files.length})`);
        console.log("Filename:", file.originalname);

        try {
          const result = await uploadImageBuffer(file.buffer);
          console.log("CLOUDINARY CALLBACK: SUCCESS");

          // ------------------------------------------------
          // STORE SUCCESSFUL UPLOAD
          // ------------------------------------------------

          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id,
          });

          console.log("Cloudinary upload successful:", result.secure_url);
        } catch (cloudinaryError) {
          if (uploadedImages.length > 0) {
            const cleanupResults = await Promise.allSettled(
              uploadedImages.map(({ publicId }) =>
                cloudinary.uploader.destroy(publicId, {
                  resource_type: "image",
                })
              )
            );
            cleanupResults.forEach((cleanupResult) => {
              if (cleanupResult.status === "rejected") {
                console.error(
                  "Failed to clean up a partial Cloudinary upload:",
                  cleanupResult.reason
                );
              }
            });
          }
          throw cloudinaryError;
        }
      }

      // --------------------------------------------------
      // ALL UPLOADS SUCCESSFUL
      // --------------------------------------------------

      console.log("\n========================================");
      console.log(
        "ALL IMAGES UPLOADED SUCCESSFULLY"
      );
      console.log(
        "Total:",
        uploadedImages.length
      );
      console.log("========================================\n");

      return res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        count: uploadedImages.length,
        images: uploadedImages,
      });
    } catch (error) {
      console.error("UPLOAD-MULTIPLE FAILED");
      console.error("message:", error.message);
      console.error("http_code:", error.http_code);
      console.error("name:", error.name);
      console.error("Cloudinary response:", error.cloudinaryResponse);
      console.error("error:", error);

      const cloudinaryMessage =
        error.cloudinaryResponse?.error?.message || error.message;

      return res.status(500).json({
        success: false,
        message: cloudinaryMessage || "Failed to upload images to Cloudinary",
        errorCode: error.http_code || "CLOUDINARY_UPLOAD_ERROR",
        cloudinaryError: {
          message: error.message,
          http_code: error.http_code,
          name: error.name,
          response: error.cloudinaryResponse,
        },
      });
    }
  }
);

// ======================================================
// VEHICLE ROUTES
// ======================================================

app.use(
  "/api/vehicles",
  vehicleRoutes
);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/auth", adminAuthRoutes);
app.use("/api/sell-requests", sellRequestRoutes);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "\n========================================"
    );

    console.error(
      "GLOBAL SERVER ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(error);

    // --------------------------------------------------
    // MULTER ERRORS
    // --------------------------------------------------

    if (
      error instanceof multer.MulterError
    ) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message:
            "Image size must be less than 10 MB",
        });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message:
            "Maximum 8 images are allowed",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // --------------------------------------------------
    // FILE TYPE ERROR
    // --------------------------------------------------

    if (
      error.message ===
      "Only image files are allowed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only image files are allowed",
      });
    }

    // --------------------------------------------------
    // GENERIC ERROR
    // --------------------------------------------------

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Something went wrong",
    });
  }
);

// ======================================================
// SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n========================================");
  console.log(
    `Server running on http://localhost:${PORT}`
  );
  console.log("========================================\n");
});