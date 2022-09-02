import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
  pokemon: defineTable({
    id: s.number(),
    name: s.string(),
    spriteUrl: s.string(),
    totalVotes: s.number(),
    votesFor: s.number(),
  }),
  sessions: defineTable({
    generation: s.number(),
    id: s.number(),
    offset: s.number(),
  }),
});
