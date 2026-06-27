import { Clock, Flame, Heart, Mail, MapPin, Phone, Sparkles } from "lucide-react";

type InfoCardProps = {
  icon: "clock" | "flame" | "heart" | "mail" | "map" | "phone" | "sparkles";
  title: string;
  children: React.ReactNode;
};

const icons = {
  clock: Clock,
  flame: Flame,
  heart: Heart,
  mail: Mail,
  map: MapPin,
  phone: Phone,
  sparkles: Sparkles,
};

export function InfoCard({ icon, title, children }: InfoCardProps) {
  const Icon = icons[icon];
  return (
    <div className="card-elevated rounded-2xl border border-gold/15 bg-cream p-5 sm:p-6 md:p-8">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta/15 to-gold/15 text-terracotta sm:mb-4 sm:h-12 sm:w-12">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-deep-teal sm:text-xl">
        {title}
      </h3>
      <div className="mt-2 text-sm text-espresso-soft/80 sm:text-base">
        {children}
      </div>
    </div>
  );
}
