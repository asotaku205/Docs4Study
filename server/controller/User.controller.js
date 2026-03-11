import User from "../models/User.js";
import BlogPost from "../models/BlogPost.js";
import Course from "../models/Course.js";
import Document from "../models/Document.js";

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
                .select('-content -comments -likedBy')
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

            // Kiểm tra người dùng đã thích blog này chưa
            const hasLiked = blog.likedBy?.includes(userId);
            
            let updatedBlog;
            if (hasLiked) {
                // Bỏ thích: xóa người dùng khỏi likedBy và giảm số lượng
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
                // Thích: thêm người dùng vào likedBy và tăng số lượng
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

    async getAllDocuments(req, res) {
        try {
            const { category, search, page = 1, limit = 10 } = req.query;
            const query = { status: 'published', isDeleted: { $ne: true } };

            if (category && category !== 'all') {
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
            const total = await Document.countDocuments(query);
            const documents = await Document.find(query)
                .populate('author', 'fullName email avatar')
                .populate('category', 'name slug color')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            return res.status(200).json({
                success: true,
                data: documents,
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

    async getDocumentById(req, res) {
        try {
            const { id } = req.params;
            const document = await Document.findOneAndUpdate(
                { _id: id, status: 'published', isDeleted: { $ne: true } },
                { $inc: { views: 1 } },
                { new: true }
            ).populate('author', 'fullName email avatar')
             .populate('category', 'name slug color')
             .populate('comments.user', 'fullName avatar');

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: document
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async createDocument(req, res) {
        try {
            const { title, content, description, category, fileUrl, fileType, fileSize } = req.body;
            const userId = req.user._id;

            if (!title || !content || !fileUrl) {
                return res.status(400).json({
                    success: false,
                    message: "Title, content and file are required"
                });
            }

            const document = new Document({
                title,
                content,
                description,
                category,
                fileUrl,
                fileType,
                fileSize,
                author: userId,
                status: 'pending'
            });

            await document.save();

            return res.status(201).json({
                success: true,
                message: "Document submitted successfully, waiting for admin approval",
                data: document
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async likeDocument(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;
            
            const document = await Document.findById(id);
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }

            const hasLiked = document.likedBy?.includes(userId);
            
            let updatedDocument;
            if (hasLiked) {
                updatedDocument = await Document.findByIdAndUpdate(
                    id,
                    { 
                        $pull: { likedBy: userId },
                        $inc: { likes: -1 }
                    },
                    { new: true }
                ).populate('author', 'fullName email avatar')
                 .populate('category', 'name slug color');
            } else {
                updatedDocument = await Document.findByIdAndUpdate(
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
                data: updatedDocument,
                liked: !hasLiked
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async addDocumentComment(req, res) {
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

            const document = await Document.findByIdAndUpdate(
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

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: document
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Server error"
            });
        }
    }

    async getMyProfile(req, res) {
        try {
            const userId = req.user._id;
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const [blogCount, docCount, courseCount, myBlogs, myDocs] = await Promise.all([
                BlogPost.countDocuments({ author: userId, isDeleted: { $ne: true } }),
                Document.countDocuments({ author: userId, isDeleted: { $ne: true } }),
                Course.countDocuments({ instructor: userId, isDeleted: { $ne: true } }),
                BlogPost.find({ author: userId, isDeleted: { $ne: true } })
                    .populate('category', 'name slug color')
                    .sort({ createdAt: -1 })
                    .limit(20)
                    .lean(),
                Document.find({ author: userId, isDeleted: { $ne: true } })
                    .populate('category', 'name slug color')
                    .sort({ createdAt: -1 })
                    .limit(20)
                    .lean()
            ]);

            return res.status(200).json({
                success: true,
                data: {
                    user,
                    stats: { blogs: blogCount, documents: docCount, courses: courseCount },
                    blogs: myBlogs,
                    documents: myDocs
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Server error" });
        }
    }

    async getUserProfile(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).select('fullName email avatar role createdAt');
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const [blogCount, docCount, courseCount, blogs, documents] = await Promise.all([
                BlogPost.countDocuments({ author: id, status: 'published', isDeleted: { $ne: true } }),
                Document.countDocuments({ author: id, status: 'published', isDeleted: { $ne: true } }),
                Course.countDocuments({ instructor: id, isDeleted: { $ne: true }, isPublished: true }),
                BlogPost.find({ author: id, status: 'published', isDeleted: { $ne: true } })
                    .populate('category', 'name slug color')
                    .sort({ createdAt: -1 })
                    .limit(20)
                    .lean(),
                Document.find({ author: id, status: 'published', isDeleted: { $ne: true } })
                    .populate('category', 'name slug color')
                    .sort({ createdAt: -1 })
                    .limit(20)
                    .lean()
            ]);

            return res.status(200).json({
                success: true,
                data: {
                    user,
                    stats: { blogs: blogCount, documents: docCount, courses: courseCount },
                    blogs,
                    documents
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Server error" });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user._id;
            const { fullName, avatar } = req.body;

            const updateData = {};
            if (fullName) updateData.fullName = fullName;
            if (avatar !== undefined) updateData.avatar = avatar;

            const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: { user }
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            return res.status(500).json({ success: false, message: error.message || "Server error" });
        }
    }

    async search(req, res) {
        try {
            const { q = '', type = 'all', page = 1, limit = 12 } = req.query;

            const trimmed = q.trim();
            if (!trimmed || trimmed.length < 2) {
                return res.status(200).json({
                    success: true,
                    data: { blogs: [], documents: [], courses: [], users: [] },
                    query: trimmed,
                    totalResults: 0,
                    totals: { blogs: 0, documents: 0, courses: 0, users: 0 }
                });
            }

            // Thoát ký tự đặc biệt của regex
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Tách thành các từ và tạo regex theo logic OR (bất kỳ từ nào khớp)
            const words = trimmed.split(/\s+/).filter(w => w.length >= 2).map(escapeRegex);
            if (words.length === 0) {
                return res.status(200).json({
                    success: true,
                    data: { blogs: [], documents: [], courses: [], users: [] },
                    query: trimmed,
                    totalResults: 0,
                    totals: { blogs: 0, documents: 0, courses: 0, users: 0 }
                });
            }

            // Tạo regex khớp BẤT KỲ từ nào (logic OR)
            const orWordsRegex = words.join('|');
            const searchRegex = { $regex: orWordsRegex, $options: 'i' };

            // Regex đơn giản cho khớp từng từ riêng lẻ
            const singleWordRegex = { $regex: escapeRegex(trimmed), $options: 'i' };

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const parsedLimit = parseInt(limit);
            const results = {};

            // Hàm hỗ trợ: tính điểm độ liên quan của tài liệu (cao hơn = liên quan hơn)
            const scoreItem = (item, titleField = 'title', descField = 'description') => {
                let score = 0;
                const titleVal = (item[titleField] || '').toLowerCase();
                const descVal = (item[descField] || '').toLowerCase();
                const queryLower = trimmed.toLowerCase();
                const wordsLower = words.map(w => w.toLowerCase());

                // Khớp chính xác tiêu đề = ưu tiên cao nhất
                if (titleVal === queryLower) score += 100;
                // Tiêu đề bắt đầu bằng từ khóa
                else if (titleVal.startsWith(queryLower)) score += 80;
                // Tiêu đề chứa cụm từ chính xác
                else if (titleVal.includes(queryLower)) score += 60;
                // Tiêu đề chứa tất cả các từ
                else if (wordsLower.every(w => titleVal.includes(w))) score += 40;

                // Mô tả chứa cụm từ chính xác
                if (descVal.includes(queryLower)) score += 20;
                // Mô tả chứa tất cả các từ
                else if (wordsLower.every(w => descVal.includes(w))) score += 10;

                return score;
            };

            // Tìm kiếm Blog — chỉ tiêu đề & mô tả, KHÔNG tìm trong nội dung
            if (type === 'all' || type === 'blogs') {
                const blogQuery = {
                    status: 'published',
                    isDeleted: { $ne: true },
                    $or: [
                        { title: searchRegex },
                        { description: searchRegex }
                    ]
                };
                const blogLimit = type === 'all' ? 6 : parsedLimit;
                const blogSkip = type === 'all' ? 0 : skip;
                const [blogs, blogTotal] = await Promise.all([
                    BlogPost.find(blogQuery)
                        .populate('author', 'fullName email avatar')
                        .populate('category', 'name slug color')
                        .sort({ createdAt: -1 })
                        .skip(blogSkip)
                        .limit(blogLimit)
                        .lean(),
                    BlogPost.countDocuments(blogQuery)
                ]);
                // Sắp xếp theo điểm độ liên quan
                results.blogs = blogs
                    .map(b => ({ ...b, _score: scoreItem(b) }))
                    .sort((a, b) => b._score - a._score)
                    .map(({ _score, ...rest }) => rest);
                results.blogTotal = blogTotal;
            }

            // Tìm kiếm Tài liệu — chỉ tiêu đề & mô tả
            if (type === 'all' || type === 'documents') {
                const docQuery = {
                    status: 'published',
                    isDeleted: { $ne: true },
                    $or: [
                        { title: searchRegex },
                        { description: searchRegex }
                    ]
                };
                const docLimit = type === 'all' ? 6 : parsedLimit;
                const docSkip = type === 'all' ? 0 : skip;
                const [documents, docTotal] = await Promise.all([
                    Document.find(docQuery)
                        .populate('author', 'fullName email avatar')
                        .populate('category', 'name slug color')
                        .sort({ createdAt: -1 })
                        .skip(docSkip)
                        .limit(docLimit)
                        .lean(),
                    Document.countDocuments(docQuery)
                ]);
                results.documents = documents
                    .map(d => ({ ...d, _score: scoreItem(d) }))
                    .sort((a, b) => b._score - a._score)
                    .map(({ _score, ...rest }) => rest);
                results.docTotal = docTotal;
            }

            // Tìm kiếm Khóa học — chỉ tiêu đề & mô tả
            if (type === 'all' || type === 'courses') {
                const courseQuery = {
                    isDeleted: { $ne: true },
                    isPublished: true,
                    $or: [
                        { title: searchRegex },
                        { description: searchRegex }
                    ]
                };
                const courseLimit = type === 'all' ? 6 : parsedLimit;
                const courseSkip = type === 'all' ? 0 : skip;
                const [courses, courseTotal] = await Promise.all([
                    Course.find(courseQuery)
                        .populate('category', 'name slug color')
                        .sort({ createdAt: -1 })
                        .skip(courseSkip)
                        .limit(courseLimit)
                        .lean(),
                    Course.countDocuments(courseQuery)
                ]);
                results.courses = courses
                    .map(c => ({ ...c, _score: scoreItem(c) }))
                    .sort((a, b) => b._score - a._score)
                    .map(({ _score, ...rest }) => rest);
                results.courseTotal = courseTotal;
            }

            // Tìm kiếm Người dùng — chỉ theo tên (để giảm nhiễu)
            if (type === 'all' || type === 'users') {
                const userQuery = {
                    isActive: true,
                    fullName: searchRegex
                };
                const userLimit = type === 'all' ? 6 : parsedLimit;
                const userSkip = type === 'all' ? 0 : skip;
                const [users, userTotal] = await Promise.all([
                    User.find(userQuery)
                        .select('fullName email avatar role createdAt')
                        .sort({ createdAt: -1 })
                        .skip(userSkip)
                        .limit(userLimit),
                    User.countDocuments(userQuery)
                ]);
                results.users = users;
                results.userTotal = userTotal;
            }

            const totalResults = (results.blogTotal || 0) + (results.docTotal || 0) + (results.courseTotal || 0) + (results.userTotal || 0);

            return res.status(200).json({
                success: true,
                data: {
                    blogs: results.blogs || [],
                    documents: results.documents || [],
                    courses: results.courses || [],
                    users: results.users || []
                },
                totals: {
                    blogs: results.blogTotal || 0,
                    documents: results.docTotal || 0,
                    courses: results.courseTotal || 0,
                    users: results.userTotal || 0
                },
                query: q.trim(),
                totalResults,
                pagination: {
                    page: parseInt(page),
                    limit: parsedLimit
                }
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