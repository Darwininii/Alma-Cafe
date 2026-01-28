import {
  EditorContent,
  type JSONContent,
  useEditor,
  type Editor as EditorType,
} from "@tiptap/react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validators";
import StarterKit from "@tiptap/starter-kit";
import { type ReactNode, useEffect, useState } from "react";
import { CustomButton } from "../../shared/CustomButton";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered 
} from "lucide-react";

interface Props {
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  initialContent?: JSONContent;
}

const ToolbarButton = ({ 
  onClick, 
  isActive, 
  icon: Icon,
  label 
}: { 
  onClick: () => void; 
  isActive: boolean; 
  icon?: any;
  label?: string;
}) => (
  <CustomButton
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    variant={isActive ? "solid" : "ghost"}
    size="icon"
    className={`h-8 w-8 p-0 ${isActive ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10"}`}
    centerIcon={Icon}
  >
    {label}
  </CustomButton>
);

export const MenuBar = ({ editor }: { editor: EditorType | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-neutral-50 dark:bg-zinc-800/50 border-b border-neutral-200 dark:border-white/10 rounded-t-xl mb-2">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        icon={Heading1}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        icon={Heading2}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        icon={Heading3}
      />
      
      <div className="w-px h-6 bg-neutral-300 dark:bg-white/20 mx-1 self-center" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={Bold}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={Italic}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        icon={Strikethrough}
      />

       <div className="w-px h-6 bg-neutral-300 dark:bg-white/20 mx-1 self-center" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon={List}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon={ListOrdered}
      />
    </div>
  );
};

export const Editor = ({ setValue, errors, initialContent }: Props) => {
  // We need to force update to show active states in toolbar
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      setValue("description", content, { shouldValidate: true });
    },
    // Listen to transaction to update toolbar state on selection change/content change
    onTransaction: () => {
      forceUpdate((x) => x + 1);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[200px] p-4 prose prose-sm sm:prose-base dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
      },
    },
  });

  // Sync initial content when it changes (async data loading)
  useEffect(() => {
    if (editor && initialContent) {
      // Check if editor content matches initialContent to avoid loops
      // We only force update if the editor is essentially empty (default state) to respect user edits
      // This fixes the bug where reopening a form might show empty state if data loads late
      if (editor.getText() === "" && editor.isEmpty) {
         editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);
  
  return (
    <div className="w-full border border-neutral-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <MenuBar editor={editor} />

      <EditorContent editor={editor} />

      {errors.description && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs font-medium border-t border-red-100 dark:border-red-900/30">
          {(errors.description.message as ReactNode) ||
            "Debe escribir una descripción"}
        </div>
      )}
    </div>
  );
};
