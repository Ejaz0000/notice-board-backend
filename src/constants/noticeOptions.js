const NOTICE_TYPES = {
  WARNING_DISCIPLINARY: {
    id: "WARNING_DISCIPLINARY",
    name: "Warning / Disciplinary",
  },
  PERFORMANCE_IMPROVEMENT: {
    id: "PERFORMANCE_IMPROVEMENT",
    name: "Performance Improvement",
  },
  APPRECIATION_RECOGNITION: {
    id: "APPRECIATION_RECOGNITION",
    name: "Appreciation / Recognition",
  },
  ATTENDANCE_LEAVE_ISSUE: {
    id: "ATTENDANCE_LEAVE_ISSUE",
    name: "Attendance / Leave Issue",
  },
  PAYROLL_COMPENSATION: {
    id: "PAYROLL_COMPENSATION",
    name: "Payroll / Compensation",
  },
  CONTRACT_ROLE_UPDATE: {
    id: "CONTRACT_ROLE_UPDATE",
    name: "Contract / Role Update",
  },
  ADVISORY_PERSONAL_REMINDER: {
    id: "ADVISORY_PERSONAL_REMINDER",
    name: "Advisory / Personal Reminder",
  },
};

const DEPARTMENTS = {
  ALL_DEPARTMENTS: { id: "ALL_DEPARTMENTS", name: "All Departments" },
  INDIVIDUAL: { id: "INDIVIDUAL", name: "Individual" },
  SALES: { id: "SALES", name: "Sales" },
  MARKETING: { id: "MARKETING", name: "Marketing" },
  IT: { id: "IT", name: "IT" },
  HR: { id: "HR", name: "Human Resources" },
};

const getNoticeTypeById = (id) => {
  return NOTICE_TYPES[id] || null;
};

const getDepartmentById = (id) => {
  return DEPARTMENTS[id] || null;
};

const getDepartmentsByIds = (ids) => {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => DEPARTMENTS[id]).filter(Boolean);
};

module.exports = {
  NOTICE_TYPES,
  DEPARTMENTS,
  getNoticeTypeById,
  getDepartmentById,
  getDepartmentsByIds,
};
