import fs from "node:fs/promises";
import path from "node:path";

import axios from "axios";
import pLimit from "p-limit";

import { BASE_URL, RAW_DIR, USER_AGENT } from "./constants";
import { getPathFromUrl } from "./utils";

const limit = pLimit(4);
const MIRROR_PREFIX = "https://r.jina.ai/http://";

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function cachePathForUrl(url: string): string {
  const urlPath = getPathFromUrl(url);
  const cleanPath = urlPath
    .replace(/[?&=]/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\//, "");
  const safe = cleanPath.length > 0 ? cleanPath : "index";
  return path.join(RAW_DIR, `${safe}.html`);
}

export async function ensureDataDirectories(): Promise<void> {
  await fs.mkdir(RAW_DIR, { recursive: true });
}

export async function fetchCached(
  inputUrl: string,
  options?: { force?: boolean },
): Promise<string> {
  const url = inputUrl.startsWith("http")
    ? inputUrl
    : new URL(inputUrl, BASE_URL).toString();
  const cacheFile = cachePathForUrl(url);

  await fs.mkdir(path.dirname(cacheFile), { recursive: true });

  if (!options?.force) {
    try {
      return await fs.readFile(cacheFile, "utf8");
    } catch {
      // Cache miss, continue to network fetch.
    }
  }

  return limit(async () => {
    // Basic politeness delay between requests.
    await sleep(600);

    const target = url.replace(/^https?:\/\//, "");
    const mirrorUrl = `${MIRROR_PREFIX}${target}`;

    const doRequest = async () =>
      axios.get<string>(mirrorUrl, {
        responseType: "text",
        timeout: 20_000,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/plain,text/markdown,*/*",
        },
      });

    let response;
    try {
      response = await doRequest();
    } catch {
      await sleep(500);
      response = await doRequest();
    }

    await fs.writeFile(cacheFile, response.data, "utf8");
    return response.data;
  });
}
