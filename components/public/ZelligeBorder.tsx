export function ZelligeBorder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent ${className}`}
      aria-hidden
    />
  );
}

export function ZelligePattern({ className = "" }: { className?: string }) {
  return <div className={`zellige-bg ${className}`} aria-hidden />;
}
