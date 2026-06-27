import Image from "next/image";

type ArchFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ArchFrame({
  src,
  alt,
  className = "",
  priority = false,
}: ArchFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-t-[50%] border-2 border-gold/30 shadow-lg ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
      />
    </div>
  );
}
