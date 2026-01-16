
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Headers - Allow all for debugging
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

console.log("Edge Function 'wompi-checkout' loaded.");

serve(async (req) => {
    // 1. Handle CORS Preflight (OPTIONS)
    // This must be the very first thing to avoid CORS errors in browser
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        console.log("Request received:", req.method);

        // 2. Load Environment Variables (Inside handler to avoid startup crash)
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const WOMPI_PRIVATE_KEY = Deno.env.get("VITE_WOMPI_SECRECT_KEY") || Deno.env.get("VITE_WOMPI_SECRET_KEY");

        // Validate Critical Env Vars
        if (!SUPABASE_URL) throw new Error("Missing Env: SUPABASE_URL");
        if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing Env: SUPABASE_SERVICE_ROLE_KEY. Check your Dashboard Secrets.");
        if (!WOMPI_PRIVATE_KEY) throw new Error("Missing Env: VITE_WOMPI_SECRECT_KEY. Add it to Supabase Edge Function Secrets.");

        // 3. Initialize Supabase Client
        // We do this here so if it fails, we catch the error instead of crashing the function
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // 4. Parse Body
        const payload = await req.json();
        const { items, payment, customer_id, address_id, sessionId } = payload;

        console.log("Payload parsed. Items:", items?.length);

        // 5. Wompi Environment Setup
        const isTest = WOMPI_PRIVATE_KEY.includes("prv_test_");
        const WOMPI_API_URL = isTest ? "https://sandbox.wompi.co/v1/transactions" : "https://production.wompi.co/v1/transactions";

        // 6. Validations
        if (!items || items.length === 0 || !customer_id || !address_id || !payment) {
            throw new Error("Missing required fields: items, payment, customer_id, address_id");
        }

        // 7. Data Verification (Prices)
        const productIds = items.map((i: any) => i.productId);
        const { data: products, error: productsError } = await supabaseAdmin
            .from('productos')
            .select('id, name, price, images, slug')
            .in('id', productIds);

        if (productsError || !products) {
            throw new Error("DB Error getting products: " + productsError?.message);
        }

        // Calculate Total & Prepare Items
        let totalAmount = 0;
        const orderItemsToInsert = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error(`Product ${item.productId} unavailable`);

            const quantity = item.quantity;
            const linePrice = Number(product.price) * quantity;
            totalAmount += linePrice;

            orderItemsToInsert.push({
                products_id: product.id,
                cantidad: quantity,
                price: product.price,
                product_snapshot: {
                    name: product.name,
                    slug: product.slug,
                    image: product.images?.[0] || null,
                    price_at_purchase: product.price
                }
            });
        }

        // 8. Wompi Transaction (Charge)
        const reference = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const amountInCents = Math.round(totalAmount * 100);

        // Construct Payment Method Logic
        let paymentMethodPayload: any = {};

        switch (payment.type) {
            case "CARD":
                if (!payment.token || !payment.installments) throw new Error("Missing token or installments for CARD");
                paymentMethodPayload = {
                    type: "CARD",
                    token: payment.token,
                    installments: payment.installments
                };
                break;
            case "NEQUI":
                if (!payment.phone_number) throw new Error("Missing phone_number for NEQUI");
                paymentMethodPayload = {
                    type: "NEQUI",
                    phone_number: payment.phone_number
                };
                break;
            case "PSE":
                // Wompi requires specific fields for PSE
                paymentMethodPayload = {
                    type: "PSE",
                    user_type: payment.user_type,
                    user_legal_id: payment.user_legal_id,
                    user_legal_id_type: payment.user_legal_id_type,
                    financial_institution_code: payment.financial_institution_code,
                    payment_description: `Pago a Comercio - ${reference}`
                };
                break;
            case "BANCOLOMBIA_TRANSFER":
            case "BANCOLOMBIA_COLLECT":
            case "NEQUI_PUSH": // Though NEQUI type is preferred usually
            case "DAVIPLATA":
            case "EFECTY":
                paymentMethodPayload = {
                    type: payment.type,
                    // Async methods might need user details inside payment_method depending on method, but usually just type for basic ones or user_legal_id if strict
                };
                break;
            default:
                // Fallback: try to pass what was sent if it's a raw object? 
                // Or default to CARD if token exists?
                if (payment.token) {
                    paymentMethodPayload = {
                        type: "CARD",
                        token: payment.token,
                        installments: payment.installments || 1
                    };
                } else {
                    throw new Error("Unsupported payment type or missing data");
                }
        }

        const wompiPayload: any = {
            amount_in_cents: amountInCents,
            currency: "COP",
            customer_email: payment.email,
            reference: reference,
            payment_method: paymentMethodPayload,
            acceptance_token: payment.acceptance_token,
            session_id: sessionId || undefined
        };

        // SIGNATURE GENERATION (Integrity)
        const WOMPI_INTEGRITY_SECRET = Deno.env.get("WOMPI_INTEGRITY_SECRET") || Deno.env.get("VITE_WOMPI_INTEGRITY_SECRET");

        if (WOMPI_INTEGRITY_SECRET) {
            const signatureString = `${reference}${amountInCents}COP${WOMPI_INTEGRITY_SECRET}`;
            const encoder = new TextEncoder();
            const data = encoder.encode(signatureString);
            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            wompiPayload.signature = signature;
            console.log("Generated Signature for Integrity:", signature);
        } else {
            console.warn("WARNING: No WOMPI_INTEGRITY_SECRET found. Transaction might fail if integrity is enabled.");
        }

        console.log("Initiating Wompi transaction:", reference, "URL:", WOMPI_API_URL);

        const wompiResponse = await fetch(WOMPI_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WOMPI_PRIVATE_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(wompiPayload)
        });

        const wompiResult = await wompiResponse.json();

        // Check Wompi Error
        if (!wompiResponse.ok || wompiResult.error) {
            console.error("Wompi Error:", wompiResult);
            return new Response(JSON.stringify({
                error: "Wompi Payment Failed",
                details: wompiResult.error?.messages || wompiResult.data?.status_message || wompiResult
            }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }); // 422 Unprocessable Entity
        }

        const transactionData = wompiResult.data;
        const transactionId = transactionData.id;
        const status = transactionData.status;

        // 9. Save Order to Supabase
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                customer_id,
                address_id,
                total_amount: totalAmount,
                reference,
                transaction_id: transactionId,
                payment_status: status,
                payment_method: transactionData.payment_method_type || "CARD",
                wompi_response: transactionData,
                currency: "COP"
            })
            .select()
            .single();

        if (orderError) {
            console.error("DB Order Insert Error:", orderError);
            // Return specific DB error to frontend for debugging
            return new Response(JSON.stringify({
                error: "Database Insert Failed",
                details: orderError,
                payload_attempted: { reference, payment_status: status, total_amount: totalAmount }
            }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Save Items
        const itemsWithId = orderItemsToInsert.map(i => ({ ...i, order_id: orderData.id }));
        await supabaseAdmin.from('orders_item').insert(itemsWithId);

        // Success Response
        return new Response(JSON.stringify({
            success: true,
            order: orderData,
            wompiStatus: status
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200
        });

    } catch (error: any) {
        console.error("Function Handler Error:", error);
        return new Response(JSON.stringify({
            error: error.message || "Internal Server Error",
            stack: error.stack // Optional: Return stack for easier debugging (careful in prod)
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500
        });
    }
});
