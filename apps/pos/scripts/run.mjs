import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));

const readPort = (file) => {
  try {
    const content = readFileSync(join(dir, "..", file), "utf8");
    for (const line of content.split("\n")) {
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      if (key === "PORT") return line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    return null;
  }
  return null;
};

const port = readPort(".env.local") || readPort(".env") || "7100";
const mode = process.argv[2] === "start" ? "start" : "dev";
const nextBin = join(dir, "..", "node_modules", "next", "dist", "bin", "next");

const args = [nextBin, mode];
if (mode === "dev") args.push("--webpack");
args.push("-p", port);

const child = spawn(process.execPath, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
