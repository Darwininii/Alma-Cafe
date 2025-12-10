interface Props {
  className?: string;
}

export const Separator = ({ className }: Props) => {
  return <div className={`h-px bg-black my-4 ${className || ""}`} />;
};
