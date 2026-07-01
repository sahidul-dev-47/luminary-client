import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { ebookId, title, price, writerId, writerEmail, buyerEmail } = body;

    if (!buyerEmail || !ebookId || !title || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: buyerEmail,

      // Success URL → Tomar "success" folder e
      success_url: `${origin}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ebooks/${ebookId}?canceled=true`,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        ebookId,
        buyerEmail,
        writerId: writerId || "unknown",
        writerEmail: writerEmail || "unknown",
        price: price.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}