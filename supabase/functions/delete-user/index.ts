import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { target_user_id } = await req.json();
    if (!target_user_id) {
       return new Response(JSON.stringify({ error: "Missing target_user_id" }), { 
         status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } 
       });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const MASTER_ADMIN_EMAIL = Deno.env.get("MASTER_ADMIN_EMAIL");
    const isGodMode = MASTER_ADMIN_EMAIL && user.email === MASTER_ADMIN_EMAIL;
    const isSelfDeletion = user.id === target_user_id;

    if (!isGodMode && !isSelfDeletion) {
      return new Response(JSON.stringify({ error: "Forbidden: Not allowed to delete this user" }), { 
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(target_user_id);
    
    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
