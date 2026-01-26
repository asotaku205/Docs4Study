import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faHeading,
  faListUl,
  faListOl,
  faQuoteLeft,
  faUndo,
  faRedo,
  faLink,
  faImage,
  faParagraph
} from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

const MenuBar = ({ editor }) => {
  const fileInputRef = useRef(null);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result;
        if (src) {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    event.target.value = '';
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-input bg-muted/30 sticky top-0 z-10">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {/* Text Style */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('paragraph') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faParagraph} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Paragraph
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('heading', { level: 1 }) ? 'bg-muted font-bold' : ''
        }`}
      >
        <span className="text-sm font-bold">H1</span>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Heading 1
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('heading', { level: 2 }) ? 'bg-muted font-bold' : ''
        }`}
      >
        <span className="text-sm font-bold">H2</span>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Heading 2
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('heading', { level: 3 }) ? 'bg-muted font-bold' : ''
        }`}
      >
        <span className="text-sm font-bold">H3</span>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Heading 3
        </span>
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Text Format */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('bold') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faBold} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Bold (Ctrl+B)
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('italic') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faItalic} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Italic (Ctrl+I)
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('strike') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faStrikethrough} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Strikethrough
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('code') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Inline Code
        </span>
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('bulletList') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faListUl} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Bullet List
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('orderedList') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faListOl} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Numbered List
        </span>
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Quote & Code Block */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('blockquote') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faQuoteLeft} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Blockquote
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('codeBlock') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Code Block
        </span>
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Insert */}
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded hover:bg-muted transition-colors relative group ${
          editor.isActive('link') ? 'bg-muted' : ''
        }`}
      >
        <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Insert Link
        </span>
      </button>

      <button
        type="button"
        onClick={addImage}
        className="p-2 rounded hover:bg-muted transition-colors relative group"
      >
        <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Upload Image
        </span>
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Undo/Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30 relative group"
      >
        <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Undo (Ctrl+Z)
        </span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30 relative group"
      >
        <FontAwesomeIcon icon={faRedo} className="w-4 h-4" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Redo (Ctrl+Y)
        </span>
      </button>
    </div>
  );
};

const TipTapEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable history from StarterKit to avoid duplicate
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-75 p-4',
      },
    },
  });

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
