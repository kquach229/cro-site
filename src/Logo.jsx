export default function Logo({ size = 32 }) {
  return (
    <span className="brand">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <path d="M7 8h18l-7 8.5V23l-4 2v-8.5z" fill="var(--on-accent)" />
        <circle cx="24" cy="24" r="3.5" fill="var(--pop)" />
      </svg>
      <b>
        Kenny<span>CRO</span>
      </b>
    </span>
  );
}
