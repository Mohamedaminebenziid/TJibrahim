import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  crumbs?: { href?: string; label: string }[];
}) {
  return (
    <div className="mb-10">
      {crumbs && (
        <nav className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-black/40 mb-4">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {c.href ? <Link href={c.href} className="hover:text-black">{c.label}</Link> : <span className="text-black/70">{c.label}</span>}
              {i < crumbs.length - 1 && <ChevronRight size={10} />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-black/60 mt-2">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function Btn({
  children,
  href,
  variant = "outline",
  type,
  name,
  value,
  formAction,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "outline" | "solid" | "danger";
  type?: "button" | "submit";
  name?: string;
  value?: string;
  formAction?: (fd: FormData) => void | Promise<void>;
  onClick?: () => void;
  className?: string;
}) {
  const base = "inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.25em] uppercase transition";
  const styles =
    variant === "solid"
      ? "bg-white text-black hover:bg-white/90"
      : variant === "danger"
      ? "border border-red-600/40 text-red-700 hover:bg-red-500/10"
      : "border hairline hover:bg-black hover:text-white";
  const cls = `${base} ${styles} ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type={type || "button"} name={name} value={value} formAction={formAction} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  textarea,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  const common = "w-full bg-transparent border hairline focus:border-black outline-none px-3 py-2 text-sm text-black";
  return (
    <label className="block">
      <div className="text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">{label}</div>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue ?? ""} required={required} rows={rows} placeholder={placeholder} className={common} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} className={common} />
      )}
      {hint && <div className="text-[10px] text-black/40 mt-1">{hint}</div>}
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-black" />
      <span className="text-sm text-black/80">{label}</span>
    </label>
  );
}
