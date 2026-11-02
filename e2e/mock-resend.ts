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
            emails.push(JSON.parse(raw) as EmailBody);
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
