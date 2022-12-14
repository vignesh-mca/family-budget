// Import Async Handler For Async Operation
const asyncHandler = require("express-async-handler");
// Import Salary Schema
const Salary = require("../models/salaryModel");
// Import Month List For Display The Month Name
const monthsList = require("../utils/Utils");

// Salary Create Controller Method
const salaryCreation = asyncHandler(async (req, res) => {
  const {
    month,
    year,
    monthlySalary,
    bonusAmount,
    otherAllowance,
    totalCR,
    pf,
    incomeTax,
    professionalTax,
    otherDeductions,
    totalDR,
    netPayAmount,
  } = req.body;

  // Check salary Record Exists Or Not
  const salaryRecordExists = await Salary.find({
    userId: req.user._id,
    month: month,
    year: year,
  });

  const getExistingRecord = salaryRecordExists.find((obj) => {
    return obj;
  });

  if (salaryRecordExists.length > 0 && getExistingRecord.isSalaryActive) {
    res.status(400);
    throw new Error("Salary record already exists for this month and year");
  }

  const salaryDetail = new Salary({
    userId: req.user._id,
    month,
    year,
    monthlySalary,
    bonusAmount,
    otherAllowance,
    totalCR,
    pf,
    incomeTax,
    professionalTax,
    otherDeductions,
    totalDR,
    netPayAmount,
  });

  await salaryDetail.save();

  res.status(201).json({
    newSalaryId: salaryDetail._id,
    message: `Your salary information created successfully.`,
  });
});

// Salary Lists Controller Method
const salaryLists = asyncHandler(async (req, res) => {
  const salaryListsResponse = await Salary.find({
    userId: req.user._id,
    isSalaryActive: true,
  }).sort({
    year: -1,
    month: 1,
  });

  if (salaryListsResponse.length > 0) {
    res.status(201).json({
      totalLength: salaryListsResponse.length,
      salaryListsResponse,
    });
  } else if (salaryListsResponse.length === 0) {
    res.status(201).json({
      totalLength: salaryListsResponse.length,
      message: "There is no data to display",
    });
  } else {
    res.status(400);
    throw new Error("Salary records not available");
  }
});

// Salary By Id Controller Method
const getSalaryById = asyncHandler(async (req, res) => {
  const salaryDataResponse = await Salary.findById(req.params.salaryId, {
    __v: 0,
  });

  if (salaryDataResponse) {
    res.status(201).json({
      salaryDataResponse,
    });
  } else {
    res.status(401).json({
      message: "Sorry, unable to fetch your data. Please try again.",
    });
  }
});

// Salary Update Controller Method
const salaryUpdateById = asyncHandler(async (req, res) => {
  const {
    month,
    year,
    monthlySalary,
    bonusAmount,
    otherAllowance,
    totalCR,
    pf,
    incomeTax,
    professionalTax,
    otherDeductions,
    totalDR,
    netPayAmount,
    isSalaryActive,
  } = req.body;

  const salary = await Salary.findById(req.params.salaryId, { __v: 0 });

  if (salary.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Access denied.");
  }

  if (salary) {
    salary.month = month || salary.month;
    salary.year = year || salary.year;
    salary.monthlySalary = monthlySalary || salary.monthlySalary;
    salary.bonusAmount = bonusAmount || salary.bonusAmount;
    salary.otherAllowance = otherAllowance || salary.otherAllowance;
    salary.totalCR = totalCR || salary.totalCR;
    salary.pf = pf || salary.pf;
    salary.incomeTax = incomeTax || salary.incomeTax;
    salary.professionalTax = professionalTax || salary.professionalTax;
    salary.otherDeductions = otherDeductions || salary.otherDeductions;
    salary.totalDR = totalDR || salary.totalDR;
    salary.netPayAmount = netPayAmount || salary.netPayAmount;
    salary.isSalaryActive = isSalaryActive || salary.isSalaryActive;

    await salary.save();

    res.status(201).json({
      message: `Your salary information updated successfully.`,
    });
  } else {
    res.status(404).json({
      message: "Sorry, unable to process your request. Please try again.",
    });
  }
});

// Salary Delete Controller Method
const salaryDeleteById = asyncHandler(async (req, res) => {
  const salary = await Salary.findById(req.params.salaryId, { __v: 0 });

  if (salary.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Access denied.");
  }

  if (salary) {
    salary.isSalaryActive = false;

    await salary.save();

    res.status(201).json({
      message: "Your salary information deleted successfully.",
    });
  } else {
    res.status(404).json({
      message: "Sorry, unable to process your request. Please try again.",
    });
  }
});

// Salary Reports Controller Method
const salaryReportLists = asyncHandler(async (req, res) => {
  const { reportType, month, year } = req.params;
  const currentDate = new Date();

  let reportMonth = 0,
    reportYear = 0,
    salaryReportDatas,
    sumOfSalaryReportDatas;

  if (reportType === "this-month") {
    reportMonth = currentDate.getMonth() + 1;
    reportYear = currentDate.getFullYear();
  } else if (reportType === "last-month") {
    reportMonth = currentDate.getMonth();
    reportYear = currentDate.getFullYear();
  } else if (reportType === "last-3-month") {
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentDate.getMonth() - 2);
    const beforeThreeMonths = currentDate.getMonth();

    reportMonth = { $gte: beforeThreeMonths, $lte: currentMonth };
    reportYear = currentDate.getFullYear();
  } else if (reportType === "last-6-month") {
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentDate.getMonth() - 5);
    const beforeSixMonths = currentDate.getMonth();

    reportMonth = { $gte: beforeSixMonths, $lte: currentMonth };
    reportYear = currentDate.getFullYear();
  } else if (reportType === "this-year") {
    reportYear = currentDate.getFullYear();
  } else if (reportType === "last-year") {
    reportYear = currentDate.getFullYear() - 1;
  } else if (reportType === "custom-year") {
    reportYear = parseInt(year);
  } else if (reportType === "custom-range") {
    reportMonth = parseInt(month);
    reportYear = parseInt(year);
  }

  if (
    reportType === "this-month" ||
    reportType === "last-month" ||
    reportType === "last-3-month" ||
    reportType === "last-6-month" ||
    reportType === "custom-range"
  ) {
    salaryReportDatas = await Salary.find({
      userId: req.user._id,
      year: reportYear,
      month: reportMonth,
      isSalaryActive: true,
    }).sort({
      year: -1,
      month: 1,
    });

    sumOfSalaryReportDatas = await Salary.aggregate(
      [
        {
          $match: {
            userId: req.user._id,
            year: reportYear,
            month: reportMonth,
            isSalaryActive: true,
          },
        },
        {
          $group: {
            _id: "$userId",
            totalCRAmount: { $sum: "$totalCR" },
            totalDRAmount: { $sum: "$totalDR" },
            totalNetPayAmount: { $sum: "$netPayAmount" },
          },
        },
      ],
      function (err, data) {
        if (err) throw err;
        return data;
      }
    );
  } else if (
    reportType === "this-year" ||
    reportType === "last-year" ||
    reportType === "custom-year"
  ) {
    salaryReportDatas = await Salary.find({
      userId: req.user._id,
      year: reportYear,
      isSalaryActive: true,
    }).sort({
      month: 1,
    });

    sumOfSalaryReportDatas = await Salary.aggregate(
      [
        {
          $match: {
            userId: req.user._id,
            year: reportYear,
            isSalaryActive: true,
          },
        },
        {
          $group: {
            _id: "$userId",
            totalCRAmount: { $sum: "$totalCR" },
            totalDRAmount: { $sum: "$totalDR" },
            totalNetPayAmount: { $sum: "$netPayAmount" },
          },
        },
      ],
      function (err, data) {
        if (err) throw err;
        return data;
      }
    );
  }

  const sumOfSalaryReportAmount = sumOfSalaryReportDatas.find(
    (report) => report
  );

  if (salaryReportDatas && salaryReportDatas.length > 0) {
    res.status(201).json({
      totalReportsLength: salaryReportDatas.length,
      salaryReportDatas,
      sumOfSalaryReport: sumOfSalaryReportAmount,
      message: `Your salary reports generated successfully on ${
        reportType === "custom-year"
          ? `year - ${reportYear}`
          : reportType === "custom-range"
          ? `${monthsList[reportMonth - 1].name} - ${reportYear}`
          : reportType
      }.`,
    });
  } else if (salaryReportDatas && salaryReportDatas.length === 0) {
    res.status(201).json({
      totalReportsLength: salaryReportDatas.length,
      message: `There is no data to display on ${
        reportType === "custom-year"
          ? `year - ${reportYear}`
          : reportType === "custom-range"
          ? `${monthsList[reportMonth - 1].name} - ${reportYear}`
          : reportType
      }`,
    });
  } else {
    res.status(400);
    throw new Error("Salary records not available");
  }
});

// Export All Salary API Controller Method
module.exports = {
  salaryCreation,
  salaryLists,
  getSalaryById,
  salaryUpdateById,
  salaryDeleteById,
  salaryReportLists,
};
