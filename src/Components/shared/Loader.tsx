import { ImSpinner10 } from "react-icons/im";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ImSpinner10 className="animated-spin" size={70} />
    </div>
  );
};
