/**
 * Minimal static file server for the demo app — Node built-ins only, so the
 * repo has zero runtime dependencies beyond Playwright itself. Playwright's
 * `webServer` config starts this before the suite and tears it down after.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "app");
const PORT = Number(process.env.PORT) || 4173;

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
    // contain to ROOT — never serve outside the app dir
    const filePath = path.join(ROOT, rel);
    if (!filePath.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }
    const body = await readFile(filePath);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
});

server.listen(PORT, () => console.log(`demo app on http://localhost:${PORT}`));
