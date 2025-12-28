import adminDocumentService from "../service/adminDocument.service.js";

const sendError = (res, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  const payload = err.payload || { error: err.message };
  return res.status(status).json(payload);
};

class AdminDocumentController {
  async getAllDocuments(req, res) {
    try {
      const result = await adminDocumentService.getAllDocuments(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async getDocumentById(req, res) {
    try {
      const document = await adminDocumentService.getDocumentById(req);
      res.status(200).json(document);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async createDocument(req, res) {
    try {
      const document = await adminDocumentService.createDocument(req);
      res.status(201).json(document);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async updateDocument(req, res) {
    try {
      const document = await adminDocumentService.updateDocument(req);
      res.status(200).json(document);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async deleteDocument(req, res) {
    try {
      const result = await adminDocumentService.deleteDocument(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async restoreDocument(req, res) {
    try {
      const result = await adminDocumentService.restoreDocument(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }
}

export default new AdminDocumentController();
