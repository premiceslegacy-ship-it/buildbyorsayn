"use client";

import { motion } from "motion/react";
import { Compass, Layers, Sparkles, Workflow, LayoutTemplate, FileCode, Briefcase, LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
}

export function AnimatedIcon({ icon: Icon, className, strokeWidth = 1.5 }: AnimatedIconProps) {
  // Define animation variants based on the icon's display name or function
  let variants = {};
  
  const iconName = Icon.displayName || Icon.name;

  switch (iconName) {
    case "Compass":
      variants = {
        hover: { rotate: [0, -15, 15, -5, 5, 0], transition: { duration: 0.6, ease: "easeInOut" } }
      };
      break;
    case "Layers":
      variants = {
        hover: { y: [0, -4, 0], transition: { duration: 0.4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } }
      };
      break;
    case "Sparkles":
      variants = {
        hover: { scale: [1, 1.2, 1], rotate: [0, 15, -15, 0], transition: { duration: 0.5, ease: "easeInOut", repeat: Infinity } }
      };
      break;
    case "Workflow":
      variants = {
        hover: { scale: 1.1, transition: { duration: 0.3, yoyo: Infinity } }
      };
      break;
    case "LayoutTemplate":
      variants = {
        hover: { scaleX: [1, 1.05, 1], scaleY: [1, 0.95, 1], transition: { duration: 0.4 } }
      };
      break;
    case "FileCode":
      variants = {
        hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }
      };
      break;
    case "Briefcase":
      variants = {
        hover: { y: [0, -5, 0], transition: { duration: 0.4, ease: "easeOut" } }
      };
      break;
    case "Search":
      variants = {
        hover: { x: [0, -2, 2, -2, 2, 0], y: [0, -2, 2, 2, -2, 0], transition: { duration: 0.5 } }
      };
      break;
    case "Terminal":
      variants = {
        hover: { opacity: [1, 0.5, 1, 0.5, 1], transition: { duration: 0.6 } }
      };
      break;
    case "Database":
      variants = {
        hover: { y: [0, -3, 0, -3, 0], transition: { duration: 0.5 } }
      };
      break;
    case "BookOpen":
      variants = {
        hover: { scaleX: [1, 1.1, 1], transition: { duration: 0.4 } }
      };
      break;
    case "Youtube":
    case "PlaySquare":
      variants = {
        hover: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0], transition: { duration: 0.4 } }
      };
      break;
    case "Code":
      variants = {
        hover: { rotate: [0, 10, -10, 0], transition: { duration: 0.4 } }
      };
      break;
    case "Target":
      variants = {
        hover: { scale: [1, 1.2, 1], transition: { duration: 0.5, ease: "easeInOut" } }
      };
      break;
    case "Brain":
      variants = {
        hover: { scale: [1, 1.05, 1], opacity: [1, 0.8, 1], transition: { duration: 0.8, ease: "easeInOut", repeat: Infinity } }
      };
      break;
    case "Shield":
      variants = {
        hover: { y: [0, -4, 0], scale: [1, 1.05, 1], transition: { duration: 0.5 } }
      };
      break;
    case "Zap":
      variants = {
        hover: { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1], transition: { duration: 0.4 } }
      };
      break;
    case "TrendingUp":
      variants = {
        hover: { x: [0, 4, 0], y: [0, -4, 0], transition: { duration: 0.5, ease: "easeInOut" } }
      };
      break;
    default:
      variants = {
        hover: { scale: 1.1, transition: { duration: 0.2 } }
      };
  }

  return (
    <motion.div
      variants={variants}
      className="flex items-center justify-center"
    >
      <Icon className={className} strokeWidth={strokeWidth} />
    </motion.div>
  );
}
