import { FaMotorcycle } from "react-icons/fa";
import { ImBell } from "react-icons/im";
import { CardFeature } from "@/Components/shared/CardFeature";

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-8 mt-6 mb-16 ">
      <CardFeature
        icon={<FaMotorcycle size={40} />}
        title="Envío a BAJO Costo"
        description="En todos nuestros productos"
      />

      <CardFeature
        icon={<ImBell size={40} />}
        title="Atención de 8am a 6pm"
        description="Visítanos, toma un café y disfruta de nuestra atención personalizada."
      />
    </div>
  );
};
