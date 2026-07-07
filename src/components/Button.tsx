import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  showArrow?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export default function Button({
  href,
  onClick,
  variant = "primary",
  showArrow = true,
  className,
  children,
  id,
}: ButtonProps) {
  const baseClasses = "btn cursor-pointer";
  const variantClasses = variant === "ghost" ? "btn--ghost" : "";
  const combinedClasses = clsx(baseClasses, variantClasses, className);

  const innerContent = (
    <>
      {showArrow && (
        <span className="ic">
          <img src="/assets/icons/arrow-right-circle.svg" alt="" />
        </span>
      )}
      {children}
    </>
  );

  if (href) {
    // If it's an external link or hash link, use simple <a>
    if (href.startsWith("http") || href.startsWith("#")) {
      return (
        <a href={href} className={combinedClasses} id={id}>
          {innerContent}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} id={id}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClasses} id={id}>
      {innerContent}
    </button>
  );
}
