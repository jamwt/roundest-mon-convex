import "tailwindcss/tailwind.css";
import "../styles/global.css";
import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";
import Head from "next/head";
import { ConvexProvider } from "convex/react";
import convex from "../backend/convex";

function MyApp({ Component, pageProps }: AppProps) {
  const description =
    "We're here to answer the eternal question: What Pokémon is roundest?";
  const title = "Roundest Pokémon - Public Poll";
  const imageMetaURL = "https://roundest.t3.gg/spheal.png";

  return (
    <ConvexProvider client={convex}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href={"https://roundest.t3.gg/favicon.ico"} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageMetaURL} />
        <meta name="twitter:image" content={imageMetaURL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=2"
        />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <meta
          name="apple-mobile-web-app-title"
          content="Round - Video Calls Powered By T3 Tools"
        />
        <meta
          name="application-name"
          content="Round - Video Calls Powered By T3 Tools"
        />
      </Head>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}

export default MyApp;
