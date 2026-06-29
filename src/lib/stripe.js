import Stripe from 'stripe';

// এনভায়রনমেন্ট ভেরিয়েবল থেকে সিক্রেট কী নিয়ে স্ট্রাইপ ইনিশিয়েট করা হচ্ছে
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: false,        // আপনি যদি প্লেইন জাভাস্ক্রিপ্ট ব্যবহার করেন
});