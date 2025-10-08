"use client";

import { useEffect, useRef } from "react";

type HTMLElementTag = keyof JSX.IntrinsicElements;

type RevealTextProps = {
  as?: HTMLElementTag;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className" | "style">;

export function RevealText({
  as = "span",
  children,
  className,
  innerClassName,
  delay = 0,
  style,
  ...rest
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Component = as as keyof JSX.IntrinsicElements;

  return (
    <Component
      ref={ref as React.Ref<any>}
      className={["reveal-text", className].filter(Boolean).join(" ")}
      style={{ ...(style ?? {}), "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...rest}
    >
      <span className={["reveal-text__inner", innerClassName].filter(Boolean).join(" ")}>{children}</span>
    </Component>
  );
}
