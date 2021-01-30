import Head from 'next/head';
import db from '../../../db.json';

const PageHead = () => (
    <Head>
        <title>Quiz - Coronavírus (Covid-19)</title>
        <meta property="og:title" content="Quiz - Coronavírus (Covid-19)" key="title" />
        <meta property="og:image" content={db.bg} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://projeto-alura-quiz.andersonfroes.vercel.app/" />
        <meta property="og:description" content="Além de testar seus conhecimentos, esse Quiz te imuniza com boa informação!" />
    </Head>
);

export default PageHead