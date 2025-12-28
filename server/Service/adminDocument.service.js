import Document from "../models/Document.js";
const MAX_LIMIT = 100;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: total === 0 ? 0 : Math.ceil(total / limit),
});
const shouldIncludeDeleted = (req) => req.query.includeDeleted === "true" || req.query.includeDeleted === "1";
const createServiceError = (message, status, payload) => {
  const error = new Error(message);
  error.status = status;
  if (payload) error.payload = payload;
  return error;
};

const getAllDocuments = async (req) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};
  if (!shouldIncludeDeleted(req)) filter.isDeleted = { $ne: true };
  if (req.query.fileType) filter.fileType = req.query.fileType;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ title: regex }, { content: regex }];
  }
  const [documents, total] = await Promise.all([
    Document.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Document.countDocuments(filter),
  ]);
  return {
    data: documents,
    pagination: buildPagination(page, limit, total),
  };
};

const getDocumentById = async (req) => {
  const filter = { _id: req.params.id };
  if (!shouldIncludeDeleted(req)) filter.isDeleted = { $ne: true };
  const document = await Document.findOne(filter);
  if (!document) throw createServiceError("Document not found", 404, { message: "Document not found" });
  return document;
};

const createDocument = async (req) => {
  const requiredFields = ["title", "content"];
  const missing = requiredFields.filter((field) => !req.body?.[field]);
  if (missing.length) throw createServiceError("Missing required fields", 400, { message: "Missing required fields", missing });
  const document = new Document(req.body);
  await document.save();
  return document;
};

const updateDocument = async (req) => {
  const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!document) throw createServiceError("Document not found", 404, { message: "Document not found" });
  return document;
};

const deleteDocument = async (req) => {
  const deletedDocument = await Document.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true, strict: false }
  );
  if (!deletedDocument) throw createServiceError("Document not found", 404, { message: "Document not found" });
  return { message: "Document deleted" };
};

const restoreDocument = async (req) => {
  const restoredDocument = await Document.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, strict: false }
  );
  if (!restoredDocument) throw createServiceError("Document not found", 404, { message: "Document not found" });
  return { message: "Document restored" };
};

export default {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
};
