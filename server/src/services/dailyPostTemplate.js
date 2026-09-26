const INDIA_TZ = "Asia/Kolkata";

const escapeXml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

const getIndiaDate = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return { iso: `${map.year}-${map.month}-${map.day}`, weekday: map.weekday };
};

const openAIRequest = async (body) => {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || `OpenAI request failed (${response.status})`);
  return data;
};

const getDailyOccasion = async ({ iso, weekday }) => {
  const schema = {
    type: "object",
    properties: {
      occasion: { type: "string" },
      headline: { type: "string" },
      greeting: { type: "string" },
      theme: { type: "string" },
      is_major_occasion: { type: "boolean" },
    },
    required: ["occasion", "headline", "greeting", "theme", "is_major_occasion"],
    additionalProperties: false,
  };

  const data = await openAIRequest({
    model: process.env.OPENAI_TEXT_MODEL || "gpt-5.6-luna",
    reasoning: { effort: "low" },
    tools: [{ type: "web_search" }],
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "You create accurate daily social-media themes for an Indian classical and light music academy in Jaipur. Check the web for the specified Indian date. Prefer an actual Indian festival, vrat, jayanti, national day, cultural observance, or music-related observance when one is genuinely relevant. Never invent an occasion. If no meaningful occasion exists, use a tasteful music/education theme instead. Keep Hindi natural and concise. Do not include phone numbers, address, or institute name in the generated copy because those are added separately.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Date: ${iso} (${weekday}), India. Return one primary theme for today's post.`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "daily_occasion",
        strict: true,
        schema,
      },
    },
  });

  return JSON.parse(data.output_text);
};

const wrapText = (text, maxChars = 26) => {
  const words = String(text || "").trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
};

const svgTextLines = (lines, { x, y, fontSize, fill, weight = 500, lineHeight = null, anchor = "middle" }) => {
  const lh = lineHeight || Math.round(fontSize * 1.25);
  return lines.map((line, i) => `<text x="${x}" y="${y + i * lh}" text-anchor="${anchor}" font-family="Noto Sans Devanagari, sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`).join("");
};

const buildPosterSvg = ({ date, occasion }) => {
  const headlineLines = wrapText(occasion.headline, 24);
  const greetingLines = wrapText(occasion.greeting, 34);
  const safeOccasion = escapeXml(occasion.occasion);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff8e6"/><stop offset="0.52" stop-color="#f7e4ad"/><stop offset="1" stop-color="#fffdf5"/>
    </linearGradient>
    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#062b69"/><stop offset="1" stop-color="#0d5da8"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <circle cx="850" cy="410" r="260" fill="#ffffff" opacity=".45"/>
  <circle cx="170" cy="430" r="190" fill="#f2b84b" opacity=".16"/>

  <rect x="0" y="0" width="1080" height="112" fill="#b71c1c"/>
  <text x="540" y="50" text-anchor="middle" font-family="Noto Sans Devanagari, sans-serif" font-size="39" font-weight="800" fill="#fff">पंडित रामजीलाल शास्त्री संगीत संस्थान</text>
  <text x="540" y="88" text-anchor="middle" font-family="Noto Sans Devanagari, sans-serif" font-size="22" font-weight="600" fill="#ffe9b0">पं. रामजीलाल शास्त्री मार्ग, ब्रह्मपुरी, जयपुर</text>

  <rect x="40" y="132" width="1000" height="72" rx="18" fill="url(#blue)"/>
  <text x="540" y="179" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="800" fill="#fff">REGISTRATION OPEN</text>

  <g transform="translate(540 300)">
    <circle r="88" fill="#fff" stroke="#b71c1c" stroke-width="8"/>
    <text x="0" y="18" text-anchor="middle" font-family="Arial, sans-serif" font-size="86" fill="#b71c1c">♫</text>
  </g>
  ${svgTextLines([safeOccasion], { x: 540, y: 450, fontSize: 32, fill: "#8b1e1e", weight: 800 })}
  ${svgTextLines(headlineLines, { x: 540, y: 505, fontSize: headlineLines.length > 1 ? 55 : 68, fill: "#063b76", weight: 900, lineHeight: 70 })}
  ${svgTextLines(greetingLines, { x: 540, y: 690, fontSize: 31, fill: "#2c2c2c", weight: 600, lineHeight: 42 })}

  <g stroke="#063b76" stroke-width="7" fill="none" opacity=".85">
    <path d="M95 785 C180 735, 260 835, 345 785 S510 735, 595 785 S760 835, 845 785 S960 735, 1030 785"/>
    <path d="M95 810 C180 760, 260 860, 345 810 S510 760, 595 810 S760 860, 845 810 S960 760, 1030 810"/>
  </g>
  <g fill="#b71c1c">
    <circle cx="150" cy="795" r="15"/><circle cx="330" cy="795" r="15"/><circle cx="520" cy="795" r="15"/><circle cx="710" cy="795" r="15"/><circle cx="900" cy="795" r="15"/>
  </g>

  <rect x="55" y="865" width="970" height="150" rx="22" fill="#062b69"/>
  <text x="540" y="915" text-anchor="middle" font-family="Arial, sans-serif" font-size="31" font-weight="800" fill="#fff">MUSIC • TABLA • DHOLAK • GUITAR</text>
  <text x="540" y="962" text-anchor="middle" font-family="Arial, sans-serif" font-size="31" font-weight="800" fill="#fff">CASIO • HARMONIUM • VOCAL</text>
  <text x="540" y="997" text-anchor="middle" font-family="Noto Sans Devanagari, sans-serif" font-size="23" font-weight="600" fill="#ffe9b0">संगीत सीखें • अभ्यास करें • मंच पर निखरें</text>

  <rect x="0" y="1060" width="1080" height="290" fill="#b71c1c"/>
  <text x="540" y="1115" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#ffe9b0">COORDINATOR: ANIL PRAKASH SHARMA</text>
  <text x="540" y="1165" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" font-weight="600" fill="#fff">40, Shanti Path, Sanjay Colony, Front of New Police Line,</text>
  <text x="540" y="1205" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" font-weight="600" fill="#fff">Pani Patch, Jaipur (Raj.)</text>
  <text x="540" y="1260" text-anchor="middle" font-family="Arial, sans-serif" font-size="35" font-weight="900" fill="#fff">☎ +91-7597337190  •  9024517634</text>
  <text x="540" y="1310" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ffe9b0">${escapeXml(date)} • Daily Cultural &amp; Music Creative</text>
</svg>`;
};

export { getIndiaDate, getDailyOccasion, buildPosterSvg };
