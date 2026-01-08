import usersService from "../Service/Users.service.js";

class UsersController {
    sendError(res, err, fallbackStatus = 500) {
        const status = err.status || fallbackStatus;
        const payload = err.payload || { error: err.message };
        return res.status(status).json(payload);
    }

    async getAllUsers(req, res) {
        try {
            const result = await usersService.getAllUsers(req);
            res.status(200).json(result);
        } catch (err) {
            this.sendError(res, err, 500);
        }
    }

    async getUserById(req, res) {
        try {
            const user = await usersService.getUserById(req);
            res.status(200).json(user);
        } catch (err) {
            this.sendError(res, err, 500);
        }
    }

    async createUser(req, res) {
        try {
            const user = await usersService.createUser(req);
            res.status(201).json(user);
        } catch (err) {
            this.sendError(res, err, 400);
        }
    }

    async updateUser(req, res) {
        try {
            const user = await usersService.updateUser(req);
            res.status(200).json(user);
        } catch (err) {
            this.sendError(res, err, 400);
        }
    }

    async deleteUser(req, res) {
        try {
            const result = await usersService.deleteUser(req);
            res.status(200).json(result);
        } catch (err) {
            this.sendError(res, err, 500);
        }
    }

    async restoreUser(req, res) {
        try {
            const result = await usersService.restoreUser(req);
            res.status(200).json(result);
        } catch (err) {
            this.sendError(res, err, 500);
        }
    }
    me(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({
                success: true,
                message: "User profile fetched successfully",
                data: {
                    user: user
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error",
            })
        }
    }
}

export default new UsersController();
