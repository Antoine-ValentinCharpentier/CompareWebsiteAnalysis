const axios = require('axios');
const cheerio = require('cheerio');
const { diffWords } = require('diff');

async function fetchPageContent(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de ${url}:`, error.message);
        return null;
    }
}

function extractText(html) {
    const $ = cheerio.load(html);
    return $('body').text().replace(/\s+/g, ' ').trim(); // Nettoyage du texte
}

async function comparePages(url1, url2) {
    const [content1, content2] = await Promise.all([
        fetchPageContent(url1),
        fetchPageContent(url2)
    ]);

    if (!content1 || !content2) {
        console.log("Impossible de comparer les pages.");
        return;
    }

    const text1 = extractText(content1);
    const text2 = extractText(content2);

    const differences = diffWords(text1, text2);

    console.log("\n=== Différences entre les deux pages ===\n");

    differences.forEach(part => {
        if (part.added) {
            process.stdout.write(`\x1b[32m+ ${part.value}\x1b[0m`); // Vert pour les ajouts
        } else if (part.removed) {
            process.stdout.write(`\x1b[31m- ${part.value}\x1b[0m`); // Rouge pour les suppressions
        } else {
            process.stdout.write(part.value); // Texte commun
        }
    });

    console.log("\n\n=== Fin des différences ===");
}

// Remplace ces URLs par celles que tu veux comparer
const url1 = 'https://docs.camunda.io/docs/8.4/apis-tools/operate-api/specifications/search-1/';
const url2 = 'https://docs.camunda.io/docs/apis-tools/operate-api/specifications/search-1/';

comparePages(url1, url2);
