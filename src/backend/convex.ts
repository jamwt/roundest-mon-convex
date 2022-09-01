import { ConvexHttpClient } from "convex/browser";
import { ConvexReactClient } from "convex/react";
import clientConfig from "../../convex/_generated/clientConfig";

const convex = new ConvexReactClient(clientConfig);
export default convex;

export function convexHttpClient() {
  return new ConvexHttpClient(clientConfig);
}
