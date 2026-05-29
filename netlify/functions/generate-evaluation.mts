import type { Config } from "@netlify/functions";
import handler from "../../api/generate-evaluation";
import { runVercelHandler } from "./_vercel-adapter.mts";

export default async (req: Request) => runVercelHandler(req, handler);

export const config: Config = {
  path: "/api/generate-evaluation",
};
