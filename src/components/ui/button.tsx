import type { ButtonHTMLAttributes, Ref } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  ref?: Ref<HTMLButtonElement>;
}

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return [
    "group inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3 font-body text-[15px] font-semibold leading-none text-center no-underline focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-secondary transition-[transform,background-color,color,box-shadow] duration-200 ease-out motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] motion-reduce:transition-none [&>span[aria-hidden]]:transition-transform motion-safe:hover:[&>span[aria-hidden]]:translate-x-0.5 motion-safe:hover:[&>span[aria-hidden]]:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-none",
    variant === "secondary" ? "bg-surface text-primary hover:bg-primary hover:text-white hover:shadow-[0_6px_18px_#00263c20]" : "bg-primary text-on-primary hover:bg-secondary hover:shadow-[0_6px_18px_#00263c30]",
    className,
  ].filter(Boolean).join(" ");
}

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return <button {...props} className={buttonClasses(variant, className)} type={type} />;
}
