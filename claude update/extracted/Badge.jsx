/**
 * Badge
 * Renders one of the supported product badges with the
 * black / white / gold showroom styling.
 *
 * Supported types: "new" | "bestseller" | "sale" | "limited"
 */

const BADGE_STYLES = {
  new: "bg-white text-[var(--sc-ink)] border border-[var(--sc-ink)]",
  bestseller: "bg-[var(--sc-ink)] text-[var(--sc-gold-soft)]",
  sale: "bg-[var(--sc-gold)] text-[var(--sc-ink)]",
  limited: "bg-white text-[var(--sc-ink)] border border-[var(--sc-gold)]",
};

const BADGE_LABELS = {
  new: "New",
  bestseller: "Best Seller",
  sale: "Sale",
  limited: "Limited Stock",
};

export default function Badge({ type }) {
  if (!BADGE_LABELS[type]) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-sm whitespace-nowrap ${BADGE_STYLES[type]}`}
    >
      {type === "limited" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sc-gold)] animate-pulse" />
      )}
      {BADGE_LABELS[type]}
    </span>
  );
}
