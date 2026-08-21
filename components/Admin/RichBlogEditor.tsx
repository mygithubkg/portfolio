'use client';
import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
  Bold, Italic, Strikethrough, Code, Link as LinkIcon,
  Image as ImageIcon, Code2, Minus, Heading2
} from 'lucide-react';

interface RichBlogEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  isMobile?: boolean;
}

export default function RichBlogEditor({ content, onChange, isMobile = false }: RichBlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = useCallback(async (file: File, editorInstance: any) => {
    // Show loading state (placeholder image)
    const tempId = `loading-${Date.now()}`;
    // Insert a temporary image or placeholder text. For simplicity, we just set a text placeholder.
    // A more advanced approach would use a custom node view for a spinner.
    editorInstance.chain().focus().insertContent(`[Uploading ${file.name}...]`).run();
    
    try {
      const url = await uploadToCloudinary(file);
      // Remove the uploading text (simplified)
      // We can just undo the insert and then insert the image
      editorInstance.chain().focus().undo().setImage({ src: url, alt: file.name }).run();
    } catch (err: any) {
      editorInstance.chain().focus().undo().insertContent(`[Failed to upload ${file.name}]`).run();
      console.error('Upload failed:', err);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disable starter-kit code block to avoid conflicts if we add specific ones, but we'll use default
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: 'tiptap-image' },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your story...',
      }),
      Markdown.configure({
        html: false,
        transformCopiedText: true,
        transformPastedText: true,
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[60vh]',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageFile(file, editor);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              handleImageFile(file, editor);
              return true;
            }
          }
        }
        return false;
      },
    },
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      // With tiptap-markdown, getMarkdown() is available. But TS doesn't know it, so we cast to any.
      const markdown = (editor as any).storage.markdown.getMarkdown();
      onChange(markdown);
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = prompt('Enter URL:', prev || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({ onClick, active, title, children }: any) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-accent/20 text-accent'
          : 'text-textSecondary hover:text-text hover:bg-surface'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Hidden file input for manual image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file, editor);
          e.target.value = '';
        }}
      />

      {/* Bubble Menu for formatting selected text (Sleek pill) */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 bg-surface/80 backdrop-blur-md border border-border shadow-2xl p-1.5 rounded-full"
      >
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code">
          <Code size={14} />
        </ToolBtn>
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Link">
          <LinkIcon size={14} />
        </ToolBtn>
      </BubbleMenu>

      {/* Floating Menu for media (only on Desktop, or when !isMobile) */}
      {!isMobile && (
        <FloatingMenu
          editor={editor}
          className="flex items-center gap-2"
        >
          <div className="flex bg-surface/80 backdrop-blur-md border border-border shadow-lg p-1 rounded-full items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-textSecondary hover:text-text hover:bg-surface rounded-full transition-colors"
              title="Add Image"
            >
              <ImageIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="p-1.5 text-textSecondary hover:text-text hover:bg-surface rounded-full transition-colors"
              title="Add Code Block"
            >
              <Code2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 text-textSecondary hover:text-text hover:bg-surface rounded-full transition-colors"
              title="Add Divider"
            >
              <Minus size={16} />
            </button>
          </div>
        </FloatingMenu>
      )}

      {/* Editor canvas */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-0">
        <EditorContent editor={editor} className="h-full pt-8 pb-32 lg:pb-8" />
      </div>

      {/* Mobile-only Sticky Toolbar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 h-14 border-t border-border bg-background/90 backdrop-blur-md flex items-center justify-around px-4 z-50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'text-accent' : 'text-textSecondary'}`}
          >
            <Heading2 size={20} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded ${editor.isActive('codeBlock') ? 'text-accent' : 'text-textSecondary'}`}
          >
            <Code2 size={20} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded text-textSecondary hover:text-text"
          >
            <ImageIcon size={20} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded text-textSecondary hover:text-text"
          >
            <Minus size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
