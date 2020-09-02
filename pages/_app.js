import '../styles/globals.css'
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>我的博客</title>
    </Head>
    <Component {...pageProps} />
    </>
}

export default MyApp
