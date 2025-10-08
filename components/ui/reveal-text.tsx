"use client";

import React, { useEffect, useRef } from "react";

type RevealTextProps<T extends React.ElementType = "span"> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  style?: React.CSSProperties;
} & Omit<React.ComponentPropsWithoutRef<T>, "children" | "className" | "style">;

export function RevealText<T extends React.ElementType = "span">({
  as,
  children,
  className,
  innerClassName,
  delay = 0,
  style,
  ...rest
}: RevealTextProps<T>) {
  const Component = as || "span";
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

  return (
    <Component
      ref={ref}
      className={["reveal-text", className].filter(Boolean).join(" ")}
      style={{ ...(style ?? {}), "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...rest}
    >
      <span className={["reveal-text__inner", innerClassName].filter(Boolean).join(" ")}>{children}</span>
    </Component>
  );
}
