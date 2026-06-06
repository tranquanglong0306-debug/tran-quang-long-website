import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "outline",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent";
  
  let variantStyles = "";
  if (variant === "primary") {
    variantStyles = "bg-white text-black hover:bg-neutral-200";
  } else if (variant === "secondary") {
    variantStyles = "bg-accent text-white hover:bg-accent-hover";
  } else {
    variantStyles = "border border-white/10 hover:border-white/40 text-white bg-black/40";
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
