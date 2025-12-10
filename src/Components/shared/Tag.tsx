type TagType = "Nuevo" | "Agotado" | "Promoción";

interface Props {
  contentTag: TagType;
}

const getTagColor = (content: TagType) => {
  if (content === "Nuevo") return "bg-yellow-500";
  if (content === "Agotado") return "bg-red-500";
  if (content === "Promoción") return "bg-amber-600";
  return "bg-gray-500";
};

export const Tag = ({ contentTag }: Props) => {
  return (
    <div className={`text-black/80 w-fit px-3 py-1 rounded border border-black/80 border-2 ${getTagColor(contentTag)}`}>
      <p className="uppercase text-sm font-bold">{contentTag}</p>
    </div>
  );
};
