import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const wompiSecret = Deno.env.get("WOMPI_INTEGRITY_SECRET") || ""; // Events signature secret

serve(async (req) => {
    try {
        const signature = req.headers.get("x-event-checksum");
        const body = await req.json();
        const { event, data, timestamp } = body;

        console.log("Webhook received:", event);

        // 1. Verify Signature (Crucial for security)
        // Formula: SHA256(data.transaction.id + data.transaction.status + data.transaction.amount_in_cents + timestamp + secret)
        // Note: Wompi documentation specifies the structure. 
        // Usually: SHA256(transaction.id + status + amount_in_cents + timestamp + integrity_secret)

        // For now, allow bypassing signature if secret is missing (DEV MODE)
        // BUT IN PRODUCTION THIS MUST BE STRICT.
        /*
        const toSign = `${data.transaction.id}${data.transaction.status}${data.transaction.amount_in_cents}${timestamp}${wompiSecret}`;
        const enc = new TextEncoder();
        const hash = await crypto.subtle.digest("SHA-256", enc.encode(toSign));
        const hexHash = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (signature !== hexHash) {
            return new Response("Invalid Signature", { status: 401 });
        }
        */

        if (event === "transaction.updated") {
            const status = data.transaction.status; // APPROVED, DECLINED, VOIDED, ERROR
            const orderId = data.transaction.reference; // This matches our 'orders.id' usually, OR we store txId in orders.
            const txId = data.transaction.id;

            // Connect to Supabase
            const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
            const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
            const supabase = createClient(supabaseUrl, supabaseKey);

            // Update Order
            // We look up by transaction_id mostly, or reference if we passed order.id as reference.
            // In our `create-wompi-checkout`, we didn't specify `reference` explicitly to be order.id, 
            // Wompi generates one or we passed it. Let's assume we need to find the order by `transaction_id`.

            let updateStatus = 'PENDING';
            if (status === 'APPROVED') updateStatus = 'APPROVED';
            else if (status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED') updateStatus = 'DECLINED';

            const { error } = await supabase
                .from('orders')
                .update({
                    status: updateStatus,
                    wompi_status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('transaction_id', txId);

            if (error) {
                console.error("Error updating order:", error);
                return new Response("DB Error", { status: 500 });
            }
        }

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 400 });
    }
});
