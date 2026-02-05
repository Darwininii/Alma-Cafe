import {  RiShoppingCartLine, RiShoppingCartFill } from "react-icons/ri";
import { MdDeleteForever, MdPayments } from "react-icons/md";
import { FaSun, FaMoon, FaUser } from "react-icons/fa6";
import { ShoppingCart } from "lucide-react";
import { BiSolidShoppingBags } from "react-icons/bi";
import { HiMiniHome, HiUserGroup } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
// Centralized Icon System
// Primary Icon Configuration (Change here to update everywhere)
const PrimaryCart = RiShoppingCartLine;
const PrimaryCartFilled = RiShoppingCartFill;

export const Icons = {
  // Navigation
  Home: HiMiniHome,
  Store: BiSolidShoppingBags,
  About: HiUserGroup,
  User: FaUser,
  Search: FaSearch,

  // Cart & Commerce
  Cart: PrimaryCart,
  CartFilled: PrimaryCartFilled,
  CartAlternate: PrimaryCartFilled, // Unified to match FloatingCart & Dock
  CartHeader: PrimaryCart, // Unified to match Cart Sheet Header
  Payment: MdPayments,
  
  // Actions
  Delete: MdDeleteForever,
  
  // UI / Theme
  Sun: FaSun,
  Moon: FaMoon,
  
  // Generic
  ShoppingLucide: ShoppingCart,
};
