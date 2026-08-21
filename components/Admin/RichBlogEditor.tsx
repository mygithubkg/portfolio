'use client';
import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import CodeBlock from '@tiptap/extension-code-block';
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Pilcrow,
  Code, Code2, ImageIcon, Minus, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Loader2
} from 'lucide-react';

interface RichBlogEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

// Convert TipTap HTML → Markdown-ish string (stored as content)
// We store HTML and render with a rich parser on the blog page if needed,
// but for backward compat we pass the raw HTML as the content string.
// The public blog page uses ReactMarkdown, so we need to store as Markdown.
// We'll store HTML and convert on read in BlogDetailClient.
export default function RichBlogEditor({ content, onChange }: RichBlogEditorProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'tiptap-code-block',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: 'tiptap-image' },
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading...';
          return 'Begin writing — type / for commands...';
        },
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor prose prose-lg max-w-none focus:outline-none min-h-[60vh] text-text font-sans leading-relaxed',
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageFile(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) { handleImageFile(file); return true; }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      // Store as HTML; BlogDetailClient will render it
      onChange(editor.getHTML());
    },
  });

  const handleImageFile = useCallback(async (file: File) => {
    if (!editor) return;
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload-image', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  const handleImageUrl = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = prompt('Enter URL:', prev || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({ onClick, active, disabled, title, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-accent/20 text-accent'
          : 'text-textSecondary hover:text-text hover:bg-surface'
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-border bg-surface/50 flex flex-wrap items-center gap-1 px-4 py-2 shrink-0">
        {/* Text type */}
        <select
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(val[1]) as 1 | 2 | 3 }).run();
          }}
          className="bg-background border border-border text-text font-mono text-xs px-2 py-1 focus:outline-none focus:border-accent"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Inline formats */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code size={15} />
        </ToolBtn>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Block formats */}
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
          <Code2 size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus size={15} />
        </ToolBtn>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
          <AlignCenter size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight size={15} />
        </ToolBtn>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Link & Image */}
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Add link">
          <LinkIcon size={15} />
        </ToolBtn>

        {/* Image upload */}
        <button
          type="button"
          title="Insert image (paste, drag-drop, or click)"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-1.5 rounded text-textSecondary hover:text-text hover:bg-surface transition-colors flex items-center gap-1.5 font-mono text-xs disabled:opacity-50"
        >
          {isUploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
          {isUploading ? 'Uploading…' : 'Image'}
        </button>
        <button
          type="button"
          onClick={handleImageUrl}
          title="Insert image from URL"
          className="p-1.5 rounded text-textSecondary hover:text-text hover:bg-surface transition-colors font-mono text-xs"
        >
          URL
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {/* Editor canvas */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="h-full px-6 py-8 [&_.tiptap-editor]:min-h-[60vh] [&_.tiptap-editor_p]:text-text [&_.tiptap-editor_p]:text-lg [&_.tiptap-editor_h1]:font-display [&_.tiptap-editor_h1]:text-5xl [&_.tiptap-editor_h1]:text-text [&_.tiptap-editor_h1]:mb-4 [&_.tiptap-editor_h2]:font-display [&_.tiptap-editor_h2]:text-3xl [&_.tiptap-editor_h2]:text-text [&_.tiptap-editor_h2]:mb-3 [&_.tiptap-editor_h3]:font-display [&_.tiptap-editor_h3]:text-xl [&_.tiptap-editor_h3]:text-text [&_.tiptap-editor_h3]:mb-2 [&_.tiptap-editor_.tiptap-code-block]:bg-surface [&_.tiptap-editor_.tiptap-code-block]:border [&_.tiptap-editor_.tiptap-code-block]:border-border [&_.tiptap-editor_.tiptap-code-block]:p-4 [&_.tiptap-editor_.tiptap-code-block]:rounded [&_.tiptap-editor_.tiptap-code-block]:font-mono [&_.tiptap-editor_.tiptap-code-block]:text-sm [&_.tiptap-editor_.tiptap-code-block]:my-4 [&_.tiptap-editor_.tiptap-image]:max-w-full [&_.tiptap-editor_.tiptap-image]:rounded [&_.tiptap-editor_.tiptap-image]:my-4 [&_.tiptap-editor_hr]:border-border [&_.tiptap-editor_hr]:my-6 [&_.tiptap-editor_ul]:list-disc [&_.tiptap-editor_ul]:pl-6 [&_.tiptap-editor_ol]:list-decimal [&_.tiptap-editor_ol]:pl-6 [&_.tiptap-editor_li]:text-text [&_.tiptap-editor_li]:text-lg [&_.tiptap-editor_a]:text-accent [&_.tiptap-editor_a]:underline [&_.tiptap-editor_blockquote]:border-l-4 [&_.tiptap-editor_blockquote]:border-accent [&_.tiptap-editor_blockquote]:pl-4 [&_.tiptap-editor_blockquote]:italic [&_.tiptap-editor_blockquote]:text-textSecondary [&_.tiptap-editor_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.tiptap-editor_.is-editor-empty]:before:text-textSecondary/40 [&_.tiptap-editor_.is-editor-empty]:before:float-left [&_.tiptap-editor_.is-editor-empty]:before:pointer-events-none [&_.tiptap-editor_code]:bg-surface [&_.tiptap-editor_code]:px-1.5 [&_.tiptap-editor_code]:py-0.5 [&_.tiptap-editor_code]:rounded [&_.tiptap-editor_code]:font-mono [&_.tiptap-editor_code]:text-sm [&_.tiptap-editor_code]:border [&_.tiptap-editor_code]:border-border"
        />
      </div>
    </div>
  );
}
