type TagType = "Nuevo" | "Agotado" | "Promoción";

interface Props {
  contentTag: TagType;
}

const getTagColor = (content: TagType) => {
  const lowerContent = content.toLowerCase();
  if (lowerContent === "Nuevo") return "bg-yellow-500";
  if (lowerContent === "Agotado") return "bg-red-500";
  if (lowerContent === "Promoción") return "bg-Amber-600";

  return "bg-gray-500";
};

export const Tag = ({ contentTag }: Props) => {
  return (
    <div className={`text-white w-fit px-2 ${getTagColor(contentTag)}`}>
      <p className="uppercase text-xs font-medium">{contentTag}</p>
    </div>
  );
};
