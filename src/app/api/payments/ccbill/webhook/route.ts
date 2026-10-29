import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Parámetros estándar que envía CCBill en su Webhook
    const clientAccnum = formData.get('clientAccnum');
    const clientSubacc = formData.get('clientSubacc');
    const transactionId = formData.get('transactionId');
    const subscriptionId = formData.get('subscriptionId');
    const eventType = formData.get('eventType'); // ej: "RenewSuccess", "NewSaleSuccess"
    const userSlug = formData.get('customUserSlug'); // Parámetro personalizado enviado durante el checkout

    if (eventType === 'NewSaleSuccess' || eventType === 'RenewSuccess') {
      // Registrar la suscripción aprobada en Supabase
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          subscription_id: subscriptionId,
          transaction_id: transactionId,
          artista_slug: userSlug,
          status: 'active',
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error actualizando suscripción en Supabase:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }

    return new Response('REQUEST ACCEPTED', { status: 200 });
  } catch (err) {
    console.error('Error procesando Webhook de CCBill:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 400 });
  }
}