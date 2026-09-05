import sharp from "sharp";
import { readFile } from "node:fs/promises";

const width = 1600;
const height = 900;
const out = "private/brand-assets/build-mcp-connector-source.png";

const sceneOverlay = Buffer.from(`
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#090b0e" stop-opacity="0.08"/>
      <stop offset="0.52" stop-color="#090b0e" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#090b0e" stop-opacity="0.16"/>
    </linearGradient>
    <radialGradient id="warmth" cx="50%" cy="42%" r="65%">
      <stop offset="0" stop-color="#b58c5d" stop-opacity="0.08"/>
      <stop offset="0.6" stop-color="#5b4936" stop-opacity="0.02"/>
      <stop offset="1" stop-color="#090b0e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#veil)"/>
  <rect width="1600" height="900" fill="url(#warmth)"/>
</svg>`);

const background = await sharp("private/brand-assets/build-mcp-connector-background.jpg")
  .resize(width, height, { fit: "cover", position: "centre" })
  .modulate({ brightness: 1.08, saturation: 1.05 })
  .composite([{ input: sceneOverlay }])
  .png()
  .toBuffer();

const type = Buffer.from(`
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <g fill="#ead9b5" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
    <text x="800" y="780" font-size="72" font-weight="700" letter-spacing="12">MCP CONNECTOR</text>
  </g>
</svg>`);

const buildLogo = await sharp("private/brand-assets/build-logo.png")
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize({ width: 320, height: 320, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const claudeSvg = await readFile("private/brand-assets/claude-ai-symbol.svg", "utf8");
const claudeLogo = await sharp(Buffer.from(claudeSvg))
  .resize({ width: 270, height: 270, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const chatgptSvg = await readFile("public/brand-logos/chatgpt.svg", "utf8");
const chatgptLogo = await sharp(Buffer.from(chatgptSvg))
  .resize({ width: 270, height: 270, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp(background)
  .composite([
    { input: claudeLogo, left: 200, top: 240 },
    { input: buildLogo, left: 640, top: 210 },
    { input: chatgptLogo, left: 1100, top: 240 },
    { input: type, left: 0, top: 0 },
  ])
  .png()
  .toFile(out);

const metadata = await sharp(out).metadata();
console.log(JSON.stringify({ out, width: metadata.width, height: metadata.height, format: metadata.format, hasAlpha: metadata.hasAlpha }));
