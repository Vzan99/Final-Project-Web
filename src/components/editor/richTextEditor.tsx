"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  Heading2,
} from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (content: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline], // Removed BulletList & ListItem to avoid duplication
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false, // Fix SSR hydration warning
  });

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor.isActive("bold")
              ? "text-blue-600 bg-gray-100"
              : "text-gray-600"
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor.isActive("italic")
              ? "text-blue-600 bg-gray-100"
              : "text-gray-600"
          }`}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor.isActive("underline")
              ? "text-blue-600 bg-gray-100"
              : "text-gray-600"
          }`}
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${
            editor.isActive("bulletList")
              ? "text-blue-600 bg-gray-100"
              : "text-gray-600"
          }`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 })
              ? "text-blue-600 bg-gray-100"
              : "text-gray-600"
          }`}
        ></button>
      </div>

      {/* Editor content container */}
      <div className="mt-1 block w-full border rounded px-3 py-2 focus-within:ring-1 focus-within:ring-gray-800 focus-within:border-gray-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
