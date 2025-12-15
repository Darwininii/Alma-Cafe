interface Props {
  className?: string;
}

export const Separator = ({ className }: Props) => {
  return <div className={`h-px bg-black dark:bg-white/80 my-4 ${className || ""}`} />;
};
