import fastify from "fastify";
import z from "zod";
import { sql } from "./lib/postgres";
import { PostgresError } from "postgres";
import { redis } from "./lib/redis";

const app = fastify();

app.get("/:code", async (request, reply) => {
  try {
    const schemaParams = z.object({
      code: z.string().min(3),
    });

    const { code } = schemaParams.parse(request.params);

    const result = await sql/*sql*/ `
      SELECT id, original_url
      FROM short_links
      WHERE short_links.code = ${code}
    `;

    if (result.length === 0) {
      return reply.status(400).send({ message: "Link not found!" });
    }

    const link = result[0];

    await redis.zIncrBy("metrics", 1, String(link.id));

    return reply.redirect(301, link.original_url);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Internal server error!" });
  }
});

app.get("/api/links", async (request, reply) => {
  try {
    const links = await sql/*sql*/ `
      SELECT *
      FROM short_links
      ORDER BY create_at DESC
    `;

    return reply.status(200).send({ links });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Internal server error!" });
  }
});

app.post("/api/links", async (request, reply) => {
  try {
    const schemaBody = z.object({
      code: z.string().min(3),
      url: z.string().url(),
    });

    const { code, url } = schemaBody.parse(request.body);

    const result = await sql/*sql*/ `
      INSERT INTO short_links (code, original_url)
      VALUES (${code}, ${url})
      RETURNING id
    `;

    const link = result[0];

    return reply.status(201).send({ shortLinkId: link.id });
  } catch (err) {
    if (err instanceof PostgresError) {
      if (err.code === "23505") {
        return reply.status(400).send({ message: "Duplicated code!" });
      }
    }

    console.error(err);
    return reply.status(500).send({ message: "Internal server error!" });
  }
});

app.get("/api/metrics", async (request, reply) => {
  try {
    const result = await redis.zRangeByScoreWithScores("metrics", 0, 50);

    const metrics = result
      .sort((a, b) => b.score - a.score)
      .map((item) => ({
        shortLinkId: +item.value,
        clicks: item.score,
      }));

    return reply.status(201).send({ metrics });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Internal server error!" });
  }
});

app
  .listen({ port: 3333 })
  .then(() =>
    console.info("Server is running at port http://localhost:3333/api")
  );
