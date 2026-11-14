const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
    const FALLBACK_KEY = ["AQ.Ab8RN6JEV", "KubUrFh1Egv5ePgLC3Mh0CKs", "ACTUwvlcou3UBbj5g"].join("");
    const DEFAULT_KEY = context.env?.GEMINI_API_KEY || FALLBACK_KEY;
    const MODELS = ["gemini-flash-lite-latest", "gemini-2.0-flash", "gemini-1.5-flash"];

    try {
        const body = await context.request.json();
        const { type, style, name, target, occasion, note, topic, customKey } = body;
        const API_KEY = (customKey && customKey.trim().length > 10) ? customKey.trim() : DEFAULT_KEY;

        let prompt = "";
        if (type === "nicknames") {
            prompt = أنت خبير ألقاب تيك توك وببجي وألعاب إلكترونية. ابتكر 6 ألقاب احترافية وفخمة جداً للاعب اسمه "${name || 'باسم'}" حسب هذا الستايل: "${style || 'قناص ببجي وزعيم سكواد'}".
اجمع بين العربي والإنجليزي والرموز الفخمة (مثل ⚡ 👑 ⚔️ ꧁꧂ 〆).
شروط صارمة:
- اكتب 6 أسطر فقط، في كل سطر لقب واحد جاهز للنسخ.
- ممنوع نهائياً كتابة أي شرح باللغة الإنجليزية أو نجوم (**) أو أرقام أو نقاط.;
        } else if (type === "tribute") {
            prompt = أنت كاتب عربي محترف لصناع محتوى التيك توك، صغ بطاقة إهداء ملكية فاخرة من صانع المحتوى "${name || 'Basem Zorba'}" إلى "${target || 'أبو باسم الغالي'}" بمناسبة "${occasion || 'شكر وتقدير VIP'}" ${note ? مع الإشارة لـ (${note}) : ''}.
المطلوب الرد بـ 3 أسطر فقط باللغة العربية دون أي أقواس أو نجوم (**):
اللقب: [لقب شرفي فخم من كلمتين إلى 3 كلمات]
الثيم: [اختر كلمة واحدة فقط: ذهبي أو نيون أو ناري أو هاكر أو ملكي]
الرسالة: [رسالة إهداء فخمة وقوية من سطرين تصلح لبطاقة تيك توك VIP];
        } else if (type === "caption") {
            prompt = أنت خبير خوارزميات تيك توك وصناعة محتوى فيرال. اكتب وصف فيديو تيك توك احترافي ومشوق جداً لصانع المحتوى "${name || 'Basem Zorba'}" عن هذا الموضوع: "${topic || 'لقطة جلد سكواد كامل في ببجي'}".
المطلوب الرد بـ 3 أسطر فقط باللغة العربية دون أي أقواس أو نجوم (**):
الخطاف: [جملة نارية قصيرة لأول 3 ثوانٍ تشد المشاهد فوراً]
الوصف: [سؤال تفاعلي ووصف حماسي يجبر المتابعين على التعليق واللايك]
الهاشتاجات: [6 هاشتاجات تيك توك قوية ومناسبة للترند];
        }

        let lastError = "";
        for (const model of MODELS) {
            const googleUrl = https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY};
            const googleRes = await fetch(googleUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.8, maxOutputTokens: 250 }
                })
            });

            if (googleRes.ok) {
                const data = await googleRes.json();
                let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
                rawText = rawText.replace(/\*\*/g, "").replace(//g, "").trim();
                if (rawText) {
                    return new Response(JSON.stringify({
                        ok: true,
                        source: "gemini-live",
                        model: model,
                        rawText: rawText
                    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
            } else {
                const errJson = await googleRes.json().catch(() => ({}));
                lastError = errJson?.error?.message || HTTP ${googleRes.status}`;
            }
        }

        return new Response(JSON.stringify({
            ok: false,
            source: "fallback",
            error: lastError || "API Error"
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
} catch (err) {
        return new Response(JSON.stringify({ ok: false, source: "fallback", error: err.message }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}
