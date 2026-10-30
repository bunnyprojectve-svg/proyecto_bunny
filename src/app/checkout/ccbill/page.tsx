'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CCBillSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold mb-2">¡Pago Confirmado!</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Tu suscripción ha sido procesada exitosamente con CCBill.
        {transactionId && (
          <span className="block mt-2 text-xs text-zinc-500">
            ID de Transacción: {transactionId}
          </span>
        )}
      </p>
      <Link
        href="/"
        className="inline-block w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Volver al Catálogo
      </Link>
    </div>
  );
}

export default function CCBillSuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-zinc-400 text-sm">Cargando confirmación...</div>}>
        <CCBillSuccessContent />
      </Suspense>
    </main>
  );
}