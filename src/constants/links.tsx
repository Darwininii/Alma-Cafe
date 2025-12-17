import { FaBoxOpen, FaFacebook, FaInstagram, FaTwitter, FaTags } from "react-icons/fa";

export const navarLinks = [
  { id: 1, title: "Inicio", href: "/" },
  { id: 2, title: "Productos", href: "/productos" },
  { id: 3, title: "Sobre Nosotros", href: "/nosotros" },
];

export const socialLinks = [
  {
    id: 1,
    title: "Facebook",
    href: "https://facebook.com",
    icon: <FaFacebook />,
  },
  {
    id: 2,
    title: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram />,
  },
  {
    id: 3,
    title: "Twitter",
    href: "https://twitter.com",
    icon: <FaTwitter />,
  },
];

export const dashboardLinks = [
  {
    id: 1,
    title: "/Produtos",
    href: "/dashboard/productos",
    icon: <FaBoxOpen size={25} />,
  },
  {
    id: 2,
    title: "/Ordenes",
    href: "/dashboard/ordenes",
    icon: <FaBoxOpen size={25} />,
  },
  {
    id: 3,
    title: "/Marcas",
    href: "/dashboard/marcas",
    icon: <FaTags size={25} />,
  },
];
