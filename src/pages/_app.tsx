// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/components/AuthContext';


function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const noLayoutRoutes = ['/login', '/sign-up'];

    return (
        <>
            <Head>
                <title>Board Games by Ankit</title>
                <meta name="description" content="Welcome to my awesome project! We offer multiple classic board games." />
                <meta name="keywords" content="board games by ankit, free online game, free board game, play board game, game by ankit, ankit" />
                <meta name="author" content="Ankit Kumar" />
                <meta property="og:title" content="Board Games - Home" />
                <meta property="og:description" content="Welcome to my awesome project! We offer multiple classic board games." />
                <meta property="og:image" content="https://example.com/og-image.jpg" />
                <meta property="og:url" content="hhttps://games-by-ankit.vercel.app" />
                <meta name="twitter:title" content="Board Games - Home - Home" />
                <meta name="twitter:description" content="Welcome to my awesome website. We offer great content and services!" />
                <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://games-by-ankit.vercel.app/" />
            </Head>
            <AuthProvider>
                {noLayoutRoutes.includes(router.pathname) ? (
                    <Component {...pageProps} />
                ) : (
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                )}
            </AuthProvider>
        </>
    );
}

export default MyApp;
