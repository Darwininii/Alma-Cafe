interface Props {
  className?: string;
}

export const Separator = ({ className }: Props) => {
  return <div className={`h-px bg-slate-200 my-4 ${className || ""}`} />;
};
