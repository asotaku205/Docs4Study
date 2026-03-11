/**
 * Hàm tiện ích URL dùng chung.
 * Tập trung xử lý API_URL và xây dựng URL cho avatar/ảnh.
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Chuyển đổi đường dẫn tương đối từ server (ví dụ: /uploads/...) thành URL đầy đủ.
 * Giữ nguyên URL tuyệt đối và trả về giá trị gốc trong các trường hợp khác.
 */
export const resolveFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  return url;
};

/**
 * Lấy URL avatar của người dùng với DiceBear làm dự phòng.
 * @param {string|null} avatar  - đường dẫn hoặc URL avatar
 * @param {string}      name    - tên hiển thị (dùng để tạo avatar dự phòng)
 */
export const getAvatarUrl = (avatar, name) => {
  if (!avatar) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'User'}`;
  return resolveFileUrl(avatar);
};

/**
 * Lấy URL ảnh với placeholder dự phòng.
 * @param {string|null}  url          - đường dẫn hoặc URL ảnh
 * @param {string}       placeholder  - ảnh dự phòng (mặc định: '/library.png')
 */
export const getImageUrl = (url, placeholder = '/library.png') => {
  if (!url) return placeholder;
  return resolveFileUrl(url);
};

/**
 * Chọn ảnh nổi bật tốt nhất từ các trường image/images của bài viết blog.
 */
export const getFeaturedImage = (image, images) => {
  if (image) return getImageUrl(image);
  if (images?.length > 0 && images[0]?.url) return getImageUrl(images[0].url);
  return '/library.png';
};
