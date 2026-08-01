import { useEffect, useRef, type ReactNode } from "react";
import {
  initAnalyticsRuntime,
  trackMockupInView,
  trackSectionView,
  type MockupId,
  type SectionId,
} from "@/lib/analytics";

/** Boots global analytics listeners once for the app shell. */
export function AnalyticsRuntime() {
  useEffect(() => initAnalyticsRuntime(), []);
  return null;
}

/** Fires section_view once when the wrapped block enters the viewport. */
export function SectionView({
  id,
  children,
  className,
  as: Tag = "div",
}: {
  id: SectionId;
  children?: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          trackSectionView(id);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [id]);

  return (
    <Tag ref={ref as never} className={className} data-section={id}>
      {children}
    </Tag>
  );
}

/** Fires mockup_in_view once when the mockup enters the viewport. */
export function MockupView({
  id,
  children,
  className,
}: {
  id: MockupId;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          trackMockupInView(id);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div ref={ref} className={className} data-mockup={id}>
      {children}
    </div>
  );
}
