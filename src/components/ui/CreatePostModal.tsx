import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';

import { RichTextEditor } from './RichTextEditor';

interface Props {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  editPost?: any;
}

export function CreatePostModal({ isOpen, onClose, editPost }: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    section: 'KNOWLEDGE',
    category: 'Website',
    summary: '',
    content: '',
    image: null as File | null,
  });

  React.useEffect(() => {
    if (isOpen && editPost) {
      setFormData({
        title: editPost.title || '',
        section: editPost.section || 'KNOWLEDGE',
        category: editPost.category || 'Website',
        summary: editPost.summary || '',
        content: editPost.content || '',
        image: null,
      });
      setIsSubmitted(false);
    } else if (!isOpen) {
      setTimeout(() => setIsSubmitted(false), 300);
      setFormData({
        title: '',
        section: 'KNOWLEDGE',
        category: 'Website',
        summary: '',
        content: '',
        image: null,
      });
    }
  }, [isOpen, editPost]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const extractVideoFrame = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.src = URL.createObjectURL(file);
      
      video.onloadeddata = () => {
        // Try to seek to 1 second, or halfway if it's very short
        video.currentTime = Math.min(1, Math.max(0, video.duration / 2));
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(video.src);
            if (blob) {
              const imageFile = new File([blob], "video_cover.jpg", { type: "image/jpeg" });
              resolve(imageFile);
            } else {
              reject(new Error("Cannot create blob"));
            }
          }, 'image/jpeg', 0.8);
        } else {
          URL.revokeObjectURL(video.src);
          reject(new Error("Cannot get canvas context"));
        }
      };

      video.onerror = (e) => {
        URL.revokeObjectURL(video.src);
        reject(e);
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = editPost ? editPost.imageUrl : null;
      if (formData.image) {
        if (formData.image.size > 5 * 1024 * 1024) {
          alert('Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.');
          setIsSubmitting(false);
          return;
        }
        finalImageUrl = await fileToBase64(formData.image);
      }

      let finalVideoUrl = editPost ? editPost.videoUrl : null;
      let finalVideoType = editPost ? editPost.videoType : null;

      const url = editPost ? `/api/posts/${editPost.id}` : '/api/posts';
      const method = editPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          section: formData.section,
          category: formData.category,
          summary: formData.summary,
          content: formData.content,
          imageUrl: finalImageUrl,
          videoUrl: finalVideoUrl,
          videoType: finalVideoType
        })
      });

      const data = await res.json();
      if (data.ok) {
        setIsSubmitted(true);
      } else {
        alert(data.message || 'Lỗi gửi bài');
      }
    } catch (error) {
      console.error(error);
      alert('Đã có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose()}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
              <h2 className="text-2xl font-bold text-on-surface">{editPost ? 'Chỉnh sửa bài viết' : 'Chia sẻ bài viết'}</h2>
              <button
                onClick={() => onClose()}
                className="p-2 hover:bg-surface-container-highest rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pr-4 mr-2 modal-scrollbar">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-success" />
                  <p className="text-lg font-medium text-on-surface">
                    ✅ Bài viết của bạn đã được {editPost ? 'cập nhật' : 'gửi'} thành công và đang chờ quản trị viên kiểm duyệt trước khi được công khai.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => onClose(true)}
                    className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-colors"
                  >
                    Đóng
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Tiêu đề</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 focus:outline-none focus:border-primary"
                      placeholder="Nhập tiêu đề bài viết..."
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1">Nơi đăng</label>
                      <select 
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 focus:outline-none focus:border-primary"
                        value={formData.section}
                        onChange={e => setFormData({ ...formData, section: e.target.value })}
                      >
                        <option value="KNOWLEDGE">📖 Kiến thức</option>
                        <option value="COMMUNITY">👥 Cộng đồng</option>
                      </select>
                      <p className="mt-2 text-xs text-on-surface-variant italic">
                        {formData.section === 'KNOWLEDGE' 
                          ? 'Chia sẻ hướng dẫn, mẹo bảo mật hoặc kiến thức phòng chống lừa đảo.'
                          : 'Chia sẻ trải nghiệm thực tế, cảnh báo hoặc câu chuyện bạn đã gặp.'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1">Danh mục</label>
                      <select 
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 focus:outline-none focus:border-primary"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option>Website</option>
                        <option>Email</option>
                        <option>Tin nhắn</option>
                        <option>Ngân hàng</option>
                        <option>Mạng xã hội</option>
                        <option>AI Scam</option>
                        <option>Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Mô tả ngắn</label>
                    <textarea
                      rows={2}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 focus:outline-none focus:border-primary resize-none"
                      placeholder="Mô tả ngắn gọn nội dung bài viết..."
                      value={formData.summary}
                      onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-on-surface-variant flex items-center gap-2">
                        Ảnh bìa hoặc Frame từ Video (không bắt buộc)
                        {isExtracting && <span className="text-xs text-primary animate-pulse">Đang xử lý video...</span>}
                      </label>
                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            const fileInput = document.getElementById('cover-image-input') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                          className="text-xs text-error hover:underline flex items-center gap-1 font-bold"
                        >
                          <X className="w-3 h-3" /> Hủy ảnh
                        </button>
                      )}
                    </div>
                    <input
                      id="cover-image-input"
                      type="file"
                      accept="image/*,video/*"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-sm"
                      disabled={isExtracting}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          setFormData({ ...formData, image: null });
                          return;
                        }
                        
                        if (file.type.startsWith('video/')) {
                          setIsExtracting(true);
                          try {
                            const imageFile = await extractVideoFrame(file);
                            setFormData({ ...formData, image: imageFile });
                          } catch (err) {
                            console.error("Lỗi trích xuất ảnh từ video", err);
                            alert("Không thể lấy ảnh từ video này. Vui lòng chọn ảnh tĩnh.");
                            setFormData({ ...formData, image: null });
                            e.target.value = '';
                          } finally {
                            setIsExtracting(false);
                          }
                        } else {
                          setFormData({ ...formData, image: file });
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Nội dung chi tiết</label>
                    <RichTextEditor 
                      value={formData.content} 
                      onChange={val => setFormData({ ...formData, content: val })} 
                      placeholder="Chia sẻ nội dung chi tiết..."
                    />
                  </div>



                  <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/30 mt-6">
                    <button
                      type="button"
                      disabled={isSubmitting || isExtracting}
                      onClick={() => onClose()}
                      className="px-6 py-2 text-on-surface-variant hover:text-primary transition-colors font-medium disabled:opacity-50"
                    >
                      Hủy
                    </button>
                    <motion.button
                      whileHover={{ scale: isSubmitting || isExtracting ? 1 : 1.03 }}
                      transition={{ duration: 0.25 }}
                      type="submit"
                      disabled={isSubmitting || isExtracting}
                      className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        editPost ? 'Cập nhật' : 'Gửi bài'
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
