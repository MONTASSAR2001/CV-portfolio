import { createAPIFileRoute } from "@tanstack/react-start/api";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const APIRoute = createAPIFileRoute("/api/webhook")({
  POST: async ({ request }) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeKey || !webhookSecret) {
      return new Response("Stripe not configured", { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" as any });

    let event: Stripe.Event;
    
    try {
      const payload = await request.text();
      const signature = request.headers.get("stripe-signature") as string;
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (userId) {
        const url = process.env.VITE_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
        
        if (url && key) {
          const supabase = createClient(url, key, { auth: { persistSession: false } });
          
          await supabase
            .from("profiles")
            .update({ subscription_tier: "premium" })
            .eq("id", userId);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  },
});
