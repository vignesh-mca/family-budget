const express = require("express");
const router = express.Router();

// Import User Authentication Middleware
const { authUser } = require("../middlewares/AuthMiddleware");

// Import Salary Controllers
const {
  salaryCreation,
  salaryLists,
  getSalaryById,
  salaryUpdateById,
  salaryDeleteById,
  salaryReportLists,
} = require("../controller/SalaryController");

// Salary route end-point
router.route("/api/salary/add").post(authUser, salaryCreation);
router.route("/api/salary/lists").get(authUser, salaryLists);
router
  .route("/api/salary/:salaryId")
  .get(getSalaryById)
  .put(authUser, salaryUpdateById);
router.route("/api/salary/remove/:salaryId").put(authUser, salaryDeleteById);
router
  .route("/api/salary/report/:reportType/:month?/:year?")
  .get(authUser, salaryReportLists);

// Export all salary router end-point
module.exports = router;
