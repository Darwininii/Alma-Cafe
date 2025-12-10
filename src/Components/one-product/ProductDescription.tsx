import type { Json } from "@/supabase/supabase";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import { NotebookPen } from "lucide-react";

interface Props {
  content: JSONContent | Json;
}

export const ProductDescription = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content as JSONContent,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-lg prose-invert max-w-none text-gray-100 marker:text-orange-400",
      },
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mt-16 bg-black/20 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black/80 to-rose-600" />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white/10 rounded-xl">
          <NotebookPen size={32} className="text-white/80" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Descripción del Producto
        </h2>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 md:p-8">
        <EditorContent editor={editor} />
      </div>
    </motion.div>
  );
};
