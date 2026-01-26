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

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-input bg-muted/30 sticky top-0 z-10">
      {/* Text Style */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('paragraph') ? 'bg-muted' : ''
        }`}
        title="Paragraph"
      >
        <FontAwesomeIcon icon={faParagraph} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-muted font-bold' : ''
        }`}
        title="Heading 1"
      >
        <span className="text-sm font-bold">H1</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-muted font-bold' : ''
        }`}
        title="Heading 2"
      >
        <span className="text-sm font-bold">H2</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('heading', { level: 3 }) ? 'bg-muted font-bold' : ''
        }`}
        title="Heading 3"
      >
        <span className="text-sm font-bold">H3</span>
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Text Format */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('bold') ? 'bg-muted' : ''
        }`}
        title="Bold"
      >
        <FontAwesomeIcon icon={faBold} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('italic') ? 'bg-muted' : ''
        }`}
        title="Italic"
      >
        <FontAwesomeIcon icon={faItalic} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('strike') ? 'bg-muted' : ''
        }`}
        title="Strikethrough"
      >
        <FontAwesomeIcon icon={faStrikethrough} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('code') ? 'bg-muted' : ''
        }`}
        title="Inline Code"
      >
        <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('bulletList') ? 'bg-muted' : ''
        }`}
        title="Bullet List"
      >
        <FontAwesomeIcon icon={faListUl} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('orderedList') ? 'bg-muted' : ''
        }`}
        title="Numbered List"
      >
        <FontAwesomeIcon icon={faListOl} className="w-4 h-4" />
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Quote & Code Block */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('blockquote') ? 'bg-muted' : ''
        }`}
        title="Quote"
      >
        <FontAwesomeIcon icon={faQuoteLeft} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('codeBlock') ? 'bg-muted' : ''
        }`}
        title="Code Block"
      >
        <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Insert */}
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded hover:bg-muted transition-colors ${
          editor.isActive('link') ? 'bg-muted' : ''
        }`}
        title="Insert Link"
      >
        <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={addImage}
        className="p-2 rounded hover:bg-muted transition-colors"
        title="Insert Image"
      >
        <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
      </button>

      <div className="w-px bg-border mx-1" />

      {/* Undo/Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30"
        title="Undo"
      >
        <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-30"
        title="Redo"
      >
        <FontAwesomeIcon icon={faRedo} className="w-4 h-4" />
      </button>
    </div>
  );
};

const TipTapEditor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
