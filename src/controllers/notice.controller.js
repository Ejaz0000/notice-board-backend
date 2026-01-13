const Notice = require("../models/Notice");
const {
  getNoticeTypeById,
  getDepartmentsByIds,
} = require("../constants/noticeOptions");


const getStatusFromDate = (publishDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pubDate = new Date(publishDate);
  pubDate.setHours(0, 0, 0, 0);
  
  return pubDate <= today ? "published" : "unpublished";
};


exports.createNotice = async (req, res) => {
  try {
    const files = req.files || [];

    const attachments = files.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
      publicId: file.filename,
    }));

   
    const noticeType = getNoticeTypeById(req.body.noticeType);
    if (!noticeType) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid notice type",
        errors: {
          noticeType: "Please select a valid notice type",
        },
      });
    }

    
    const targetDepartments = getDepartmentsByIds(req.body.targetDepartments);
    if (targetDepartments.length === 0) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "At least one valid department is required",
        errors: {
          targetDepartments: "Please select at least one valid department",
        },
      });
    }

    
    const status = getStatusFromDate(req.body.publishDate);

    const notice = await Notice.create({
      ...req.body,
      noticeType,
      targetDepartments,
      attachments,
      status,
    });

    res.status(201).json({
      status: true,
      statusCode: 201,
      message: "Notice created successfully",
      data: { notice },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to create notice",
    });
  }
};


exports.createDraft = async (req, res) => {
  try {
    const files = req.files || [];

    const attachments = files.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
      publicId: file.filename,
    }));

    
    const noticeType = getNoticeTypeById(req.body.noticeType);
    if (!noticeType) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid notice type",
        errors: {
          noticeType: "Please select a valid notice type",
        },
      });
    }

   
    const targetDepartments = getDepartmentsByIds(req.body.targetDepartments);
    if (targetDepartments.length === 0) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "At least one valid department is required",
        errors: {
          targetDepartments: "Please select at least one valid department",
        },
      });
    }

    const notice = await Notice.create({
      ...req.body,
      noticeType,
      targetDepartments,
      attachments,
      status: "draft",
    });

    res.status(201).json({
      status: true,
      statusCode: 201,
      message: "Draft created successfully",
      data: { notice },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to create draft",
    });
  }
};


exports.publishDraft = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Notice not found",
      });
    }

    if (notice.status !== "draft") {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Only draft notices can be published",
        errors: {
          status: "This notice is not a draft",
        },
      });
    }

    
    const status = getStatusFromDate(notice.publishDate);

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: `Draft ${status} successfully`,
      data: { notice: updatedNotice },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid notice ID",
        errors: {
          id: "The provided notice ID is not valid",
        },
      });
    }
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to publish draft",
    });
  }
};


const formatPublishDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};


exports.getAllNotices = async (req, res) => {
  try {
    const { status, department, search, publishDate, page = 1 } = req.query;
    const limit = 8;
    const skip = (parseInt(page) - 1) * limit;

    
    let filter = { status: { $in: ["published", "unpublished"] } };

    
    if (status && ["published", "unpublished"].includes(status)) {
      filter.status = status;
    }

    
    if (department) {
      filter["targetDepartments.id"] = department;
    }

    
    if (search) {
      filter.$or = [
        { employeeId: { $regex: search, $options: "i" } },
        { employeeName: { $regex: search, $options: "i" } },
      ];
    }

    
    if (publishDate) {
      const date = new Date(publishDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      filter.publishDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const [totalCount, totalDraftCount] = await Promise.all([
      Notice.countDocuments(filter),
      Notice.countDocuments({ status: "draft" }),
    ]);
    const totalPages = Math.ceil(totalCount / limit);

    const notices = await Notice.find(filter)
      .select('-noticeBody -attachments -employeeId -employeeName -position')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

   
    const formattedNotices = notices.map(notice => ({
      ...notice,
      publishDate: formatPublishDate(notice.publishDate),
    }));

    res.json({
      status: true,
      statusCode: 200,
      message: "Notices fetched successfully",
      data: {
        notices: formattedNotices,
        totalDraftCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          perPage: limit,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: error.message,
    });
  }
};


exports.getDraftNotices = async (req, res) => {
  try {
    const { department, search, publishDate, page = 1 } = req.query;
    const limit = 8;
    const skip = (parseInt(page) - 1) * limit;

    let filter = { status: "draft" };

    
    if (department) {
      filter["targetDepartments.id"] = department;
    }

    
    if (search) {
      filter.$or = [
        { employeeId: { $regex: search, $options: "i" } },
        { employeeName: { $regex: search, $options: "i" } },
      ];
    }

    
    if (publishDate) {
      const date = new Date(publishDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      filter.publishDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const totalCount = await Notice.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const notices = await Notice.find(filter)
      .select('-noticeBody -attachments -employeeId -employeeName -position')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

   
    const formattedNotices = notices.map(notice => ({
      ...notice,
      publishDate: formatPublishDate(notice.publishDate),
    }));

    res.json({
      status: true,
      statusCode: 200,
      message: "Draft notices fetched successfully",
      data: {
        notices: formattedNotices,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          perPage: limit,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: error.message,
    });
  }
};


exports.getSingleNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Notice not found",
      });
    }

    res.json({
      status: true,
      statusCode: 200,
      message: "Notice fetched successfully",
      data: { notice },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid notice ID",
      });
    }
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to fetch notice",
    });
  }
};


exports.updateNoticeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Status is required",
        errors: {
          status: "Status field is required",
        },
      });
    }

    if (!["published", "unpublished"].includes(status)) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid status value",
        errors: {
          status: "Status must be either 'published' or 'unpublished'",
        },
      });
    }

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Notice not found",
      });
    }

    if (notice.status === "draft") {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Cannot update status of a draft notice",
        errors: {
          status: "Use the publish draft endpoint to publish a draft",
        },
      });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      status: true,
      statusCode: 200,
      message: "Notice status updated successfully",
      data: { notice: updatedNotice },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid notice ID",
        errors: {
          id: "The provided notice ID is not valid",
        },
      });
    }
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to update notice status",
    });
  }
};
