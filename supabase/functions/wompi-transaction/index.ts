import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from wompi-transaction!")

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { amount_in_cents, currency, customer_email, payment_method, reference } = await req.json()

        // 1. Get Private Key from Env (Secure)
        const privateKey = Deno.env.get('WOMPI_PRIVATE_KEY')
        if (!privateKey) {
            throw new Error('WOMPI_PRIVATE_KEY not set in Edge Function secrets')
        }

        // 2. Prepare payload for WOMPI
        const payload = {
            amount_in_cents,
            currency,
            customer_email,
            payment_method,
            reference,
            signature: null, // WOMPI V2 might not require sig for simple token transactions if using Bearer Auth, but let's check docs. Actually, Bearer Auth is standard.
            // If we needed integrity signature, we'd calculate it here using a secret integrity key.
            // For now, assuming basic Bearer Auth flow.
        }

        console.log(`Processing payment for info: ${customer_email} - Amount: ${amount_in_cents}`)

        // 3. Call WOMPI API
        // Sandbox: https://sandbox.wompi.co/v1/transactions
        // Production: https://production.wompi.co/v1/transactions
        // ideally configurable via env, defaulting to sandbox for safety
        const wompiUrl = Deno.env.get('WOMPI_API_URL') || 'https://sandbox.wompi.co/v1/transactions'

        const response = await fetch(wompiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${privateKey}`
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        console.log("WOMPI Response:", data)

        if (!response.ok) {
            return new Response(JSON.stringify({ error: data.error || 'Payment failed', details: data }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // 4. Return result to frontend
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
