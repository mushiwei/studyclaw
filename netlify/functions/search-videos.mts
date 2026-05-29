import type { Config } from "@netlify/functions";
import handler from "../../api/search-videos";
import { runVercelHandler } from "./_vercel-adapter.mts";

export default async (req: Request) => runVercelHandler(req, handler);

export const config: Config = {
  path: "/api/search-videos",
};
