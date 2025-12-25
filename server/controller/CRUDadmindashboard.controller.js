import adminDashboardService from "../service/CRUDadmindashboard.service.js";

const sendError = (res, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  const payload = err.payload || { error: err.message };
  return res.status(status).json(payload);
};

const getAllUsers = async (req, res) => {
  try {
    const result = await adminDashboardService.getAllUsers(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await adminDashboardService.getUserById(req);
    res.status(200).json(user);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await adminDashboardService.createUser(req);
    res.status(201).json(user);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await adminDashboardService.updateUser(req);
    res.status(200).json(user);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await adminDashboardService.deleteUser(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const restoreUser = async (req, res) => {
  try {
    const result = await adminDashboardService.restoreUser(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getAllCourses = async (req, res) => {
  try {
    const result = await adminDashboardService.getAllCourses(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await adminDashboardService.getCourseById(req);
    res.status(200).json(course);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await adminDashboardService.createCourse(req);
    res.status(201).json(course);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await adminDashboardService.updateCourse(req);
    res.status(200).json(course);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await adminDashboardService.deleteCourse(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const restoreCourse = async (req, res) => {
  try {
    const result = await adminDashboardService.restoreCourse(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const result = await adminDashboardService.getAllDocuments(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await adminDashboardService.getDocumentById(req);
    res.status(200).json(document);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const createDocument = async (req, res) => {
  try {
    const document = await adminDashboardService.createDocument(req);
    res.status(201).json(document);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const updateDocument = async (req, res) => {
  try {
    const document = await adminDashboardService.updateDocument(req);
    res.status(200).json(document);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const deleteDocument = async (req, res) => {
  try {
    const result = await adminDashboardService.deleteDocument(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const restoreDocument = async (req, res) => {
  try {
    const result = await adminDashboardService.restoreDocument(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const result = await adminDashboardService.getAllOrders(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await adminDashboardService.getOrderById(req);
    res.status(200).json(order);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await adminDashboardService.createOrder(req);
    res.status(201).json(order);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await adminDashboardService.updateOrder(req);
    res.status(200).json(order);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const result = await adminDashboardService.deleteOrder(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const restoreOrder = async (req, res) => {
  try {
    const result = await adminDashboardService.restoreOrder(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    const result = await adminDashboardService.getAllBlogPosts(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const getBlogPostById = async (req, res) => {
  try {
    const post = await adminDashboardService.getBlogPostById(req);
    res.status(200).json(post);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const createBlogPost = async (req, res) => {
  try {
    const post = await adminDashboardService.createBlogPost(req);
    res.status(201).json(post);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const post = await adminDashboardService.updateBlogPost(req);
    res.status(200).json(post);
  } catch (err) {
    sendError(res, err, 400);
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const result = await adminDashboardService.deleteBlogPost(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

const restoreBlogPost = async (req, res) => {
  try {
    const result = await adminDashboardService.restoreBlogPost(req);
    res.status(200).json(result);
  } catch (err) {
    sendError(res, err, 500);
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  restoreOrder,
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  restoreBlogPost,
};
