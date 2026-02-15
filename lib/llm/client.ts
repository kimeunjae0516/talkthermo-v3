import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function requestJson(system: string, user: string) {
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }
  });
  return res.choices[0]?.message?.content ?? "{}";
}
