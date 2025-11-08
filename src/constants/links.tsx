import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

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
