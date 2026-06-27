import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand text-espresso">
      <AdminNav />
      <main className="page-container py-6 sm:py-8">{children}</main>
    </div>
  );
}
