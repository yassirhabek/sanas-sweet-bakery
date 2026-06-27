import { Link } from "@/i18n/navigation";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  fullWidthMobile?: boolean;
};

const variants = {
  primary:
    "bg-terracotta text-white shadow-lg shadow-terracotta/25 hover:bg-terracotta-dark hover:shadow-terracotta/30",
  secondary:
    "border-2 border-cream/80 bg-cream/10 text-cream backdrop-blur-sm hover:bg-cream/20",
  outline:
    "border-2 border-deep-teal bg-cream text-deep-teal shadow-md shadow-espresso/10 hover:bg-deep-teal hover:text-cream hover:shadow-lg",
  ghost:
    "text-deep-teal hover:bg-deep-teal/5 border border-transparent hover:border-deep-teal/10",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  fullWidthMobile = true,
}: ButtonProps) {
  const widthClass = fullWidthMobile
    ? "w-full sm:w-auto justify-center"
    : "inline-flex";

  return (
    <Link
      href={href}
      className={`inline-flex ${widthClass} min-h-[48px] items-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 sm:px-7 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
