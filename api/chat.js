export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).send("POST only");

  try {
    const { prompt = "", fileText = "" } = req.body || {};
    const input = fileText ? `Құжат:\n${fileText}\n\nСұрақ:\n${prompt}` : prompt;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: input }],
        temperature: 0.3,
      }),
    });

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? JSON.stringify(data);
    return res.status(200).json({ text, status: r.status });
  } catch (e) {
    return res.status(200).json({ error: String(e) });
  }
}
