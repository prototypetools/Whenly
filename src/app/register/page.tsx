import Link from 'next/link';
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { requireGuest } from '@/lib/auth';
import { Card, InfoBanner } from '@/components/ui/primitives';

export const metadata: Metadata = { title: 'Daftar' };
export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  await requireGuest();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-10 sm:px-6">
      <Link href="/" className="mb-6 flex items-center gap-2.5 self-start">
        <img src="/images/whenly-logo.png" alt="Whenly" className="h-9 w-9 rounded-xl object-contain" />
        <span className="text-lg font-bold text-brand-ink">Whenly</span>
      </Link>

      <Card className="card-pad">
        <h1 className="text-xl font-bold text-brand-ink">Buat akun gratis</h1>
        <p className="mt-1 mb-5 text-sm text-brand-muted">
          Mulai dengan paket Free. Bisa di-upgrade kapan saja bila butuh fitur analitik dan anggaran.
        </p>
        <RegisterForm />
      </Card>

      <div className="mt-5">
        <InfoBanner tone="info" title="Data kamu tersimpan per akun">
          Setiap akun hanya bisa melihat datanya sendiri. Data langganan disimpan di database server, dan bisa kamu unduh
          kapan saja sebagai JSON dari halaman Profil.
        </InfoBanner>
      </div>
    </div>
  );
}
