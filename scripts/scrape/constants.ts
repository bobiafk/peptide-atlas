import path from "node:path";

export const BASE_URL = "https://thepeptidelist.com";

export const ROOT = process.cwd();
export const DATA_DIR = path.join(ROOT, "data");
export const RAW_DIR = path.join(DATA_DIR, "raw");

export const USER_AGENT =
  "peptide-script-scraper/1.0 (+https://thepeptidelist.com; research-metadata-archiver)";
