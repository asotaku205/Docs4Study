import User from "../models/User.js";
import BlogPost from "../models/BlogPost.js";
import Course from "../models/Course.js";

class UserController {
    me(req,res){
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
    
    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user._id;
            
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Old password and new password are required"
                });
            }
            
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters"
                });
            }
            
            const user = await User.findById(userId).select("+password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            
            const isPasswordValid = await user.comparePassword(oldPassword);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }
            
            user.password = newPassword;
            await user.save();
            
            return res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async getAllBlogs(req, res) {
        try {
            const { category, search, page = 1, limit = 10 } = req.query;
            const query = { status: 'published', isDeleted: { $ne: true } };

            if (category && category !== 'All Post') {
                query.category = category;
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await BlogPost.countDocuments(query);
            const blogs = await BlogPost.find(query)
                .populate('author', 'fullName email avatar')
                .populate('category', 'name slug color')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            return res.status(200).json({
                success: true,
                data: blogs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async getBlogById(req, res) {
        try {
            const { id } = req.params;
            const blog = await BlogPost.findOneAndUpdate(
                { _id: id, status: 'published', isDeleted: { $ne: true } },
                { $inc: { views: 1 } },
                { new: true }
            ).populate('author', 'fullName email avatar')
             .populate('category', 'name slug color')
             .populate('comments.user', 'fullName avatar');

            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: blog
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async createBlog(req, res) {
        try {
            const { title, content, description, category, image } = req.body;
            const userId = req.user._id;

            if (!title || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Title and content are required"
                });
            }

            const blog = new BlogPost({
                title,
                content,
                description,
                category: category || 'Development',
                image,
                author: userId,
                status: 'pending'
            });

            await blog.save();

            return res.status(201).json({
                success: true,
                message: "Blog submitted successfully, waiting for admin approval",
                data: blog
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async likeBlog(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;
            
            const blog = await BlogPost.findById(id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found"
                });
            }

            // Check if user already liked this blog
            const hasLiked = blog.likedBy?.includes(userId);
            
            let updatedBlog;
            if (hasLiked) {
                // Unlike: remove user from likedBy and decrease count
                updatedBlog = await BlogPost.findByIdAndUpdate(
                    id,
                    { 
                        $pull: { likedBy: userId },
                        $inc: { likes: -1 }
                    },
                    { new: true }
                ).populate('author', 'fullName email avatar')
                 .populate('category', 'name slug color');
            } else {
                // Like: add user to likedBy and increase count
                updatedBlog = await BlogPost.findByIdAndUpdate(
                    id,
                    { 
                        $addToSet: { likedBy: userId },
                        $inc: { likes: 1 }
                    },
                    { new: true }
                ).populate('author', 'fullName email avatar')
                 .populate('category', 'name slug color');
            }

            return res.status(200).json({
                success: true,
                data: updatedBlog,
                liked: !hasLiked
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async addComment(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user._id;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Comment content is required"
                });
            }

            const blog = await BlogPost.findByIdAndUpdate(
                id,
                { 
                    $push: { 
                        comments: {
                            user: userId,
                            content,
                            createdAt: new Date()
                        }
                    }
                },
                { new: true }
            ).populate('comments.user', 'fullName avatar');

            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: blog
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async addCourseComment(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user._id;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Comment content is required"
                });
            }

            const course = await Course.findByIdAndUpdate(
                id,
                { 
                    $push: { 
                        comments: {
                            user: userId,
                            content,
                            createdAt: new Date()
                        }
                    }
                },
                { new: true }
            ).populate('comments.user', 'fullName avatar');

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: course
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }
}
export default new UserController();