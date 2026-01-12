exports.validateNotice = (req, res, next) => {
  const {
    targetDepartments,
    noticeTitle,
    employeeId,
    employeeName,
    position,
    noticeType,
    publishDate,
    noticeBody,
  } = req.body;

  if (!Array.isArray(targetDepartments) || targetDepartments.length === 0) {
    return res.status(400).json({
      message: "At least one target department is required",
    });
  }

  if (!noticeTitle) {
    return res.status(400).json({ message: "Notice title is required" });
  }

  const isIndividualSelected = targetDepartments.some(
    (dept) => dept.id === "INDIVIDUAL"
  );

  if (isIndividualSelected) {
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    if (!employeeName) {
      return res.status(400).json({ message: "Employee name is required" });
    }

    if (!position) {
      return res.status(400).json({ message: "Position is required" });
    }
  }

  if (!noticeType) {
    return res.status(400).json({ message: "Notice type is required" });
  }

  if (!publishDate) {
    return res.status(400).json({ message: "Publish date is required" });
  }

  if (!noticeBody) {
    return res.status(400).json({ message: "Notice body is required" });
  }

  next();
};
