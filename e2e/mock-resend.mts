// POST /emails trigger: if the subject contains "MockFail", the body is stored
// but the server responds 429 (rate_limit_exceeded) instead of 200, letting
// tests assert both that the request was received and that the app handles failure.

// outsource dependencies
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import type { ServerResponse, IncomingMessage } from "node:http";

type EmailBody = Record<string, unknown>;

const emails: EmailBody[] = [];

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        req.on("error", reject);
    });
}

const server = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
        const { method, url } = req;

        if (method === "POST" && url === "/emails") {
            const raw = await readBody(req);
            const body = JSON.parse(raw) as EmailBody;
            emails.push(body);
            if (
                typeof body.subject === "string" &&
                body.subject.includes("MockFail")
            ) {
                res.writeHead(429, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({
                        statusCode: 429,
                        name: "rate_limit_exceeded",
                        message: "Too many requests",
                    }),
                );
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ id: randomUUID() }));
            return;
        }

        if (method === "GET" && url === "/__emails") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(emails));
            return;
        }

        if (method === "GET" && url === "/__health") {
            res.writeHead(200);
            res.end();
            return;
        }

        res.writeHead(404);
        res.end();
    },
);

server.listen(3101, () => {
    console.log("mock-resend listening on http://localhost:3101");
});
