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
    const DEFAULT_KEY = (context.env && context.env.GEMINI_API_KEY) ? context.env.GEMINI_API_KEY : FALLBACK_KEY;
    const MODELS = ["gemini-flash-lite-latest", "gemini-2.0-flash", "gemini-1.5-flash"];
    try {
        const body = await context.request.json();
        const type = body.type || "nicknames";
        const style = body.style || "قناص ببجي وزعيم سكواد";
        const name = body.name || "باسم";
        const target = body.target || "أبو باسم الغالي";
        const occasion = body.occasion || "شكر وتقدير VIP";
        const note = body.note || "";
        const topic = body.topic || "لقطة جلد سكواد كامل في ببجي";
        const customKey = body.customKey || "";
        const API_KEY = (customKey && customKey.trim().length > 10) ? customKey.trim() : DEFAULT_KEY;

        let prompt = "";
        if (type === "nicknames") {
            prompt = "أنت خبير ألقاب تيك توك وببجي. ابتكر 6 ألقاب احترافية وفخمة للاعب اسمه (" + name + ") حسب الستايل: (" + style + "). اجمع بين العربي والإنجليزي والرموز الفخمة. اكتب 6 أسطر فقط، في كل سطر لقب واحد بدون شرح أو أرقام أو نجوم.";
        } else if (type === "tribute") {
            prompt = "صغ بطاقة إهداء ملكية من (" + name + ") إلى (" + target + ") بمناسبة (" + occasion + ") " + (note ? "(" + note + ")" : "") + ". الرد بـ 3 أسطر فقط بالعربية:\nاللقب: [لقب شرفي فخم]\nالثيم: [ذهبي أو نيون أو ناري أو هاكر أو ملكي]\nالرسالة: [رسالة إهداء فخمة من سطرين]";
        } else {
            prompt = "اكتب وصف فيديو تيك توك فيرال لصانع المحتوى (" + name + ") عن: (" + topic + "). الرد بـ 3 أسطر فقط:\nالخطاف: [جملة نارية لأول 3 ثوان]\nالوصف: [سؤال تفاعلي حماسي]\nالهاشتاجات: [6 هاشتاجات قوية]";
        }

        let lastError = "";
        for (const model of MODELS) {
            const googleUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + API_KEY;
            const googleRes = await fetch(googleUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.8, maxOutputTokens: 250 }
                })
            });
            if (googleRes.ok) {
                const data = await googleRes.json();
                let rawText = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) ? data.candidates[0].content.parts[0].text.trim() : "";
                rawText = rawText.replace(/\*\*/g, "").trim();
                if (rawText) {
                    return new Response(JSON.stringify({ ok: true, source: "gemini-live", model: model, rawText: rawText }), { headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) });
                }
            } else {
                lastError = "HTTP " + googleRes.status;
            }
        }
        return new Response(JSON.stringify({ ok: false, source: "fallback", error: lastError }), { status: 200, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) });
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, source: "fallback", error: err.message }), { status: 200, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) });
    }
}
