import type { Config } from "@netlify/functions";

import { db } from "../../db/index.js";

import { orders } from "../../db/schema.js";

import { eq, desc } from "drizzle-orm";



export default async (req: Request) => {

  const url = new URL(req.url);



  if (req.method === "GET") {

    const username = url.searchParams.get("username");

    const query = db.select().from(orders).orderBy(desc(orders.createdAt));

    const all = username

      ? await query.where(eq(orders.username, username))

      : await query;

    return Response.json(all);

  }



  if (req.method === "POST") {

    const { username, items, total } = await req.json();

    if (!username || !items || !total) {

      return new Response("Missing fields", { status: 400 });

    }

    const [order] = await db

      .insert(orders)

      .values({ username, items, total })

      .returning();

    return Response.json(order, { status: 201 });

  }



  if (req.method === "DELETE") {

    const id = url.searchParams.get("id");

    const username = url.searchParams.get("username");

    if (!id || !username) {

      return new Response("Missing fields", { status: 400 });

    }

    const orderId = parseInt(id, 10);

    const [existing] = await db.select().from(orders).where(eq(orders.id, orderId));

    if (!existing) {

      return new Response("Not found", { status: 404 });

    }

    if (existing.username !== username) {

      return new Response("Forbidden", { status: 403 });

    }

    await db.delete(orders).where(eq(orders.id, orderId));

    return new Response(null, { status: 204 });

  }



  return new Response("Method not allowed", { status: 405 });

};



export const config: Config = {

  path: "/api/orders",

};
