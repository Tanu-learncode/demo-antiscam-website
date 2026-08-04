import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Video, FileText } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isFocused) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, isFocused]);

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    handleChange();
  };

  const handleChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Nhập đường dẫn (URL):', 'https://');
    if (url) exec('createLink', url);
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

  const handleVideo = () => {
    const url = prompt('Nhập link YouTube hoặc video:', 'https://www.youtube.com/watch?v=...');
    if (!url) return;
    
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = new URL(url).searchParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const html = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 16px 0; border-radius: 12px;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div><p><br/></p>`;
    exec('insertHTML', html);
  };

  const handlePDF = () => {
    const url = prompt('Nhập link tới file PDF (hoặc tài liệu):', 'https://');
    if (!url) return;
    const title = prompt('Nhập tên hiển thị cho tài liệu:', 'Tài liệu đính kèm');
    const html = `<a href="${url}" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(0, 150, 255, 0.1); border: 1px solid rgba(0,150,255,0.3); border-radius: 8px; color: #4dabf7; text-decoration: none; font-weight: bold; margin: 8px 0;">📄 ${title || 'Tài liệu PDF'}</a><p><br/></p>`;
    exec('insertHTML', html);
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors flex flex-col relative">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-outline-variant/50 bg-surface-container-highest/30 sticky top-0 z-10">
        <button type="button" onClick={() => exec('bold')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="In đậm"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('italic')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="In nghiêng"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('underline')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Gạch chân"><Underline className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-outline-variant/50 mx-1" />
        <button type="button" onClick={() => exec('formatBlock', 'H1')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Tiêu đề 1"><Heading1 className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('formatBlock', 'H2')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Tiêu đề 2"><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('formatBlock', 'H3')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Tiêu đề 3"><Heading3 className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-outline-variant/50 mx-1" />
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Danh sách"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Danh sách số"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('formatBlock', 'BLOCKQUOTE')} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Trích dẫn"><Quote className="w-4 h-4" /></button>
        <div className="w-px h-6 bg-outline-variant/50 mx-1" />
        <button type="button" onClick={handleLink} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Chèn Link"><LinkIcon className="w-4 h-4" /></button>
        <button type="button" onClick={handleImage} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Chèn Ảnh"><ImageIcon className="w-4 h-4" /></button>
        <button type="button" onClick={handleVideo} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Chèn Video"><Video className="w-4 h-4" /></button>
        <button type="button" onClick={handlePDF} className="p-2 hover:bg-surface-container hover:text-primary rounded text-on-surface-variant transition-colors" title="Chèn File PDF"><FileText className="w-4 h-4" /></button>
      </div>
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
