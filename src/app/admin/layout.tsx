import AdminAuthCheck from '@/components/admin/admin-auth-check';
import { Metadata } from 'next';

// 🚫 Bloquear indexación de todas las rutas admin
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </AdminAuthCheck>
  );
}
