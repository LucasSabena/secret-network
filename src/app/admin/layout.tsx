import AdminAuthCheck from '@/components/admin/admin-auth-check';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthCheck>{children}</AdminAuthCheck>;
}
