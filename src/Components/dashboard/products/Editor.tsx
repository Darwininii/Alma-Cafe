import {
  EditorContent,
  type JSONContent,
  useEditor,
  type Editor as EditorType,
} from "@tiptap/react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validators";
import StarterKit from "@tiptap/starter-kit";
import { type ReactNode } from "react";
import { CustomButton } from "../../shared/CustomButton";

interface Props {
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  initialContent?: JSONContent;
}

export const MenuBar = ({ editor }: { editor: EditorType | null }) => {
  const buttonClass = (isActive: boolean) =>
    `w-8 h-7 grid place-items-center  border text-sm rounded transition-all ${isActive
      ? "border-blue-500 bg-blue-100 text-blue-700"
      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
    }`;

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      <CustomButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        size="sm"
        effect="magnetic"
      >
        H1
      </CustomButton>

      <CustomButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        size="sm"
        effect="magnetic"
      >
        H2
      </CustomButton>

      <CustomButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        size="sm"
        effect="magnetic"
      >
        H3
      </CustomButton>

      <CustomButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        size="sm"
        effect="magnetic"
      >
        N
      </CustomButton>

      <CustomButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        size="sm"
        effect="magnetic"
      >
        K
      </CustomButton>

      <CustomButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        size="sm"
        effect="magnetic"
      >
        S
      </CustomButton>
    </div>
  );
};

export const Editor = ({ setValue, errors, initialContent }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      // Aquí actualizamos el valor del campo 'description.content en el formulario
      const content = editor.getJSON();
      setValue("description", content, { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px] prose prose-sm sm:prose-base",
      },
    },
  });

  return (
    <div className="space-y-3">
      <MenuBar editor={editor} />

      <EditorContent editor={editor} />

      {errors.description && (
        <p className="text-red-500 text-xs mt-1">
          {(errors.description.message as ReactNode) ||
            "Debe escribir una descripción"}
        </p>
      )}
    </div>
  );
};
