// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/components/AuthContext';
import Particles from '@/components/Particles';


function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const noLayoutRoutes = ['/login', '/sign-up'];

    return (
        <>
            <Head>
                <title>Board Games by Ankit</title>
                <meta name="description" content="Welcome to The Board Games by Ankit! Here you can play multiple classic board games. Online multiplayer with friends also supported." />
                <meta name="keywords" content="board games by ankit, free online game, free board game, play board game, game by ankit, ankit" />
                <meta name="author" content="Ankit Kumar" />
                <meta property="og:title" content="Board Games by Ankit - Home" />
                <meta property="og:description" content="Welcome to The Board Games by Ankit! Here you can play multiple classic board games. Online multiplayer with friends also supported." />
                <meta property="og:image" content="https://example.com/og-image.jpg" />
                <meta property="og:url" content="hhttps://games-by-ankit.vercel.app" />
                <meta name="twitter:title" content="Board Games by Ankit - Home" />
                <meta name="twitter:description" content="Welcome to The Board Games by Ankit! Here you can play multiple classic board games. Online multiplayer with friends also supported." />
                <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://games-by-ankit.vercel.app/" />
            </Head>
            <AuthProvider>
                {noLayoutRoutes.includes(router.pathname) ? (
                    <Component {...pageProps} />
                ) : (
                    <Layout>
                        <Particles id="particles" />
                        <Component {...pageProps} />
                    </Layout>
                )}
            </AuthProvider>
        </>
    );
}

export default MyApp;
