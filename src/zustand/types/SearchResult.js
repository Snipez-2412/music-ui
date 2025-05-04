// types/SearchDTO.js

/**
    * @typedef {Object} SearchDTO
    * @property {"song"|"album"} type - Loại item (song hoặc album)
    * @property {number} id - ID của album hoặc bài hát
    * @property {string} title - Tên album hoặc bài hát
    * @property {string} [signedCoverUrl] - URL ảnh bìa (nếu có)
    * @property {string} [signedFilePath] - Đường dẫn đến file âm thanh (nếu có)
    * 
    * @property {string} [artistName] - Tên nghệ sĩ (nếu có)
    * @property {number} [artistID]
    * @property {string} [signedProfileUrl] - URL ảnh đại diện của nghệ sĩ (nếu có)
 */
