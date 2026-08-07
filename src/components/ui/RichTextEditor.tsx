import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Image as ImageIcon, Video, X, Type, Package } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showCalloutMenu, setShowCalloutMenu] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isFocused) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, isFocused]);

  const exec = (command: string, val: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleChange();
  };

  const handleChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };


  const handleImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files) as File[];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Một số ảnh lớn hơn 5MB đã bị bỏ qua để tránh quá tải hệ thống.');
          continue;
        }
        const base64 = await fileToBase64(file);
        exec('insertImage', base64);
        // add a new line after image for easier typing
        exec('insertHTML', '<p><br/></p>');
      }
    };
    input.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUploadVideoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4';
    input.onchange = async (e: any) => {
      const file = e.target.files[0] as File;
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        alert('Video vượt quá dung lượng 50MB không được hỗ trợ.');
        return;
      }
      
      setIsProcessing(true);
      try {
        const base64 = await fileToBase64(file);
        const html = `<video controls src="${base64}" style="max-width: 100%; border-radius: 12px; margin: 16px 0; outline: none;"></video><p><br/></p>`;
        exec('insertHTML', html);
        setShowVideoInput(false);
      } catch (error) {
        console.error('Lỗi khi tải video:', error);
        alert('Có lỗi xảy ra khi xử lý video.');
      } finally {
        setIsProcessing(false);
      }
    };
    input.click();
  };

  const submitVideo = () => {
    if (!videoUrl) return;
    
    let embedUrl = '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = new URL(videoUrl).searchParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      alert('Chỉ hỗ trợ chèn video từ YouTube. Vui lòng nhập link YouTube hợp lệ.');
      return;
    }

    const html = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 16px 0; border-radius: 12px;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div><p><br/></p>`;
    exec('insertHTML', html);
    setShowVideoInput(false);
    setVideoUrl('');
  };

  const CALLOUT_TYPES = [
    { id: 'warning', icon: '⚠️', label: 'Cảnh báo', title: 'CẢNH BÁO', color: '#ef4444', text: 'Viết nội dung cảnh báo tại đây...' },
    { id: 'tip', icon: '💡', label: 'Mẹo', title: 'MẸO', color: '#3b82f6', text: 'Viết mẹo tại đây...' },
    { id: 'recommend', icon: '✅', label: 'Khuyến nghị', title: 'KHUYẾN NGHỊ', color: '#22c55e', text: 'Viết khuyến nghị tại đây...' },
    { id: 'info', icon: 'ℹ️', label: 'Thông tin', title: 'THÔNG TIN', color: '#94a3b8', text: 'Viết thông tin tại đây...' },
  ];

  const insertCallout = (type: any) => {
    const html = `<div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 12px; border-left: 4px solid ${type.color}; padding: 16px; margin: 16px 0;"><div style="font-weight: bold; color: ${type.color}; margin-bottom: 8px;">${type.icon} ${type.title}</div><div style="color: inherit; opacity: 0.9;">${type.text}</div></div><p><br/></p>`;
    exec('insertHTML', html);
    setShowCalloutMenu(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as File[];
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Một số ảnh lớn hơn 5MB đã bị bỏ qua để tránh quá tải.');
          continue;
        }
        const base64 = await fileToBase64(file);
        exec('insertImage', base64);
        exec('insertHTML', '<p><br/></p>');
      } else if (file.type === 'video/mp4') {
        if (file.size > 50 * 1024 * 1024) {
          alert('Video vượt quá dung lượng 50MB không được hỗ trợ.');
          continue;
        }
        const base64 = await fileToBase64(file);
        const html = `<video controls src="${base64}" style="max-width: 100%; border-radius: 12px; margin: 16px 0; outline: none;"></video><p><br/></p>`;
        exec('insertHTML', html);
      }
    }
  };

  return (
    <div 
      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors flex flex-col relative"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-outline-variant/50 bg-surface-container-highest/30 sticky top-0 z-10">
        <button type="button" onClick={() => exec('bold')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="In đậm"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('italic')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="In nghiêng"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('underline')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Gạch chân"><Underline className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-outline-variant/50 mx-1" />
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowFontSizeMenu(!showFontSizeMenu)} 
            className={`p-2 rounded transition-colors flex items-center gap-1 ${showFontSizeMenu ? 'bg-surface-container text-primary' : 'hover:bg-surface-container hover:text-primary text-on-surface-variant'}`}
            title="Kích thước chữ"
          >
            <Type className="w-4 h-4" />
            <span className="text-xs font-medium">Cỡ chữ</span>
          </button>
          
          {showFontSizeMenu && (
            <div className="absolute top-full left-0 mt-1 z-50 w-40 bg-surface-container-lowest border border-outline-variant/50 rounded-lg shadow-xl flex flex-col overflow-hidden py-1">
              {[
                { label: 'Nhỏ (13px)', value: '2' },
                { label: 'Vừa (16px)', value: '3' },
                { label: 'Lớn (18px)', value: '4' },
                { label: 'Rất lớn (24px)', value: '5' },
              ].map(size => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    exec('fontSize', size.value);
                    setShowFontSizeMenu(false);
                  }}
                  className="px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-highest hover:text-primary transition-colors"
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-outline-variant/50 mx-1" />
        
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowCalloutMenu(!showCalloutMenu)} 
            className={`p-2 rounded transition-colors ${showCalloutMenu ? 'bg-surface-container text-primary' : 'hover:bg-surface-container hover:text-primary text-on-surface-variant'}`}
            title="Chèn khung"
          >
            <Package className="w-4 h-4" />
          </button>
          
          {showCalloutMenu && (
            <div className="absolute top-full left-0 mt-1 z-50 w-48 bg-surface-container-lowest border border-outline-variant/50 rounded-lg shadow-xl flex flex-col overflow-hidden py-1">
              {CALLOUT_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => insertCallout(type)}
                  className="px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                >
                  <span>{type.icon}</span>
                  <span style={{ color: type.color }} className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" onClick={handleImage} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Chèn Ảnh"><ImageIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => setShowVideoInput(!showVideoInput)} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Chèn Video"><Video className="w-4 h-4" /></button>
      </div>
      
      {showVideoInput && (
        <div className="absolute top-14 left-4 z-20 w-80 p-4 bg-surface-container border border-outline-variant/50 rounded-xl shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-on-surface">Chèn Video</h3>
            <button type="button" onClick={() => setShowVideoInput(false)} className="text-on-surface-variant hover:text-error transition-colors"><X className="w-4 h-4"/></button>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant font-medium">Link YouTube</label>
            <input 
              autoFocus
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitVideo()}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-sm focus:outline-none focus:border-primary text-on-surface"
            />
            <div className="flex justify-end gap-2 mt-1">
              <button type="button" onClick={() => setShowVideoInput(false)} className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors">Hủy</button>
              <button type="button" onClick={submitVideo} className="px-3 py-1.5 text-xs bg-primary text-on-primary rounded font-medium hover:brightness-110 transition-colors">Chèn link</button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-on-surface-variant">Hoặc</span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleUploadVideoClick}
              disabled={isProcessing}
              className={`w-full py-2 border border-dashed rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                isProcessing 
                  ? 'border-primary/30 text-primary/50 bg-primary/5 cursor-not-allowed' 
                  : 'border-outline-variant text-on-surface hover:bg-surface-container-highest hover:border-primary/50'
              }`}
            >
              <Video className="w-4 h-4" />
              {isProcessing ? 'Đang xử lý video...' : 'Tải lên video (.mp4)'}
            </button>
            <p className="text-[10px] text-center text-on-surface-variant">Giới hạn dung lượng: 50MB</p>
          </div>
        </div>
      )}

      <div 
        ref={editorRef}
        contentEditable
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleChange}
        className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none prose prose-invert max-w-none prose-img:rounded-xl prose-img:border prose-img:border-outline-variant/30 prose-a:text-primary prose-p:my-2"
      />
      {value.trim() === '' && !isFocused && placeholder && (
        <div className="absolute top-16 left-4 text-on-surface-variant pointer-events-none opacity-50">
          {placeholder}
        </div>
      )}
    </div>
  );
}
