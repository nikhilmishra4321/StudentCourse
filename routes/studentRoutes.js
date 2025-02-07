// const express = require("express");
// const router = express.Router();
// const GeneratedCredentials = require("../models/GeneratedCredentials");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Middleware to protect student pages
// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.redirect("/studentlogin");

//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch (err) {
//     return res.redirect("/studentlogin");
//   }
// };

// // Student login page
// router.get("/studentlogin", (req, res) => {
//   res.render("studentLogin", { error: null });
// });

// // Handle student login
// router.post("/studentlogin", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await GeneratedCredentials.findOne({ email });
//     if (!student) {
//       return res.render("studentLogin", { error: "Invalid email or password" });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) {
//       return res.render("studentLogin", { error: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.cookie("token", token, { httpOnly: true });

//     return res.redirect("/studentdashboard"); // Redirect to student dashboard
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // Student dashboard (Protected Route)
// router.get("/studentdashboard", verifyToken, (req, res) => {
//   res.render("studentDashboard"); // Only accessible if logged in
// });


// // Logout
// router.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.redirect("/studentlogin");
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const GeneratedCredentials = require("../models/GeneratedCredentials");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Middleware to protect student pages
// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.redirect("/studentlogin");

//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch (err) {
//     return res.redirect("/studentlogin");
//   }
// };

// // Student login page
// router.get("/studentlogin", (req, res) => {
//   res.render("studentLogin", { error: null });
// });

// // Handle student login
// router.post("/studentlogin", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await GeneratedCredentials.findOne({ email });
//     if (!student) {
//       return res.render("studentLogin", { error: "Invalid email or password" });
//     }

//     // Compare hashed password
//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) {
//       return res.render("studentLogin", { error: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.cookie("token", token, { httpOnly: true });

//     return res.redirect("/studentdashboard"); // Redirect to student dashboard
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // Protected Student Dashboard
// router.get("/studentdashboard", verifyToken, (req, res) => {
//   res.render("studentDashboard"); // Accessible only if logged in
// });

// // Logout
// router.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.redirect("/studentlogin");
// });

// module.exports = router;










const express = require("express");
const router = express.Router();
const GeneratedCredentials = require("../models/GeneratedCredentials");
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/studentlogin");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.redirect("/studentlogin");




    
  }
};
router.get("/studentlogin", (req, res) => {
  res.render("studentLogin", { error: null });
});
router.post("/studentlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await GeneratedCredentials.findOne({ email });
    if (!student || student.password !== password) {
      return res.render("studentLogin", { error: "Wrong email or password" });
    }
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/studentdashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
router.get("/studentdashboard", verifyToken, (req, res) => {
  res.render("studentDashboard"); 
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/studentlogin");
});

module.exports = router;

