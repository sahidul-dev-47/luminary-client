import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';   

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const { ebookId, title, price, writerId, buyerEmail } = await req.json();

    if (!buyerEmail || !ebookId || !title || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: buyerEmail,
     success_url: `${origin}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ebooks/${ebookId}?canceled=true`,
      
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              metadata: { ebookId },
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        ebookId,
        buyerEmail,
        price: price.toString(),
        writerId: writerId || "unknown"
      }
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

