import documentsService from "../Service/Documents.service.js";

class DocumentsController {
  constructor() {
    this.getAllDocuments = this.getAllDocuments.bind(this);
    this.getDocumentById = this.getDocumentById.bind(this);
    this.createDocument = this.createDocument.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.restoreDocument = this.restoreDocument.bind(this);
  }

  sendError(res, err, fallbackStatus = 500) {
    const status = err.status || fallbackStatus;
    const payload = err.payload || { error: err.message };
    return res.status(status).json(payload);
  }

  async getAllDocuments(req, res) {
    try {
      const result = await documentsService.getAllDocuments(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async getDocumentById(req, res) {
    try {
      const document = await documentsService.getDocumentById(req);
      res.status(200).json(document);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async createDocument(req, res) {
    try {
      const document = await documentsService.createDocument(req);
      res.status(201).json(document);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async updateDocument(req, res) {
    try {
      const document = await documentsService.updateDocument(req);
      res.status(200).json(document);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async deleteDocument(req, res) {
    try {
      const result = await documentsService.deleteDocument(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async restoreDocument(req, res) {
    try {
      const result = await documentsService.restoreDocument(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }
}

export default new DocumentsController();
