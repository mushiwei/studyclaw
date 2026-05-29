type VercelStyleHandler = (req: any, res: any) => Promise<unknown>;

const makeResponse = () => {
  let statusCode = 200;
  const headers = new Headers({ "content-type": "application/json" });
  let body = "";

  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    setHeader(name: string, value: string) {
      headers.set(name, value);
      return res;
    },
    json(data: unknown) {
      body = JSON.stringify(data);
      headers.set("content-type", "application/json");
      return res;
    },
    send(data: unknown) {
      body = typeof data === "string" ? data : JSON.stringify(data);
      return res;
    },
  };

  return {
    res,
    toResponse: () => new Response(body, { status: statusCode, headers }),
  };
};

const parseBody = async (req: Request) => {
  if (req.method === "GET" || req.method === "HEAD") {
    return {};
  }

  const text = await req.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const runVercelHandler = async (req: Request, handler: VercelStyleHandler) => {
  const url = new URL(req.url);
  const { res, toResponse } = makeResponse();
  const requestLike = {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    query: Object.fromEntries(url.searchParams.entries()),
    body: await parseBody(req),
  };

  await handler(requestLike, res);
  return toResponse();
};
