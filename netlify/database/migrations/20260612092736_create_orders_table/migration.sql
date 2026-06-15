CREATE TABLE "orders" (
  "id" serial PRIMARY KEY,
  "username" text NOT NULL,
  "items" jsonb NOT NULL,
  "total" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
