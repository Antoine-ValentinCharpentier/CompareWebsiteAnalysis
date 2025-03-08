const fs = require('fs');
const cheerio = require('cheerio');
const { diffWords } = require('diff');

// Fonction pour lire le contenu d'un fichier
function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error.message);
        return null;
    }
}

// Fonction pour extraire le texte pertinent du HTML
function extractText(html) {
    const $ = cheerio.load(html);
    return $('body').text().replace(/\s+/g, ' ').trim(); // Nettoyage du texte
}

// Fonction pour comparer les fichiers
function compareFiles(file1, file2) {
    const content1 = readFileContent(file1);
    const content2 = readFileContent(file2);

    if (!content1 || !content2) {
        console.log("Impossible de comparer les fichiers.");
        return;
    }

    const text1 = extractText(content1);
    const text2 = extractText(content2);

    const differences = diffWords(text1, text2);

    console.log("\n=== Différences entre les deux fichiers ===\n");

    differences.forEach(part => {
        if (part.added) {
            process.stdout.write(`\x1b[32m+ ${part.value}\x1b[0m`); // Texte ajouté (en vert)
        } else if (part.removed) {
            process.stdout.write(`\x1b[31m- ${part.value}\x1b[0m`); // Texte supprimé (en rouge)
        } else {
            process.stdout.write(part.value); // Texte identique
        }
    });

    console.log("\n\n=== Fin des différences ===");
}

// Utilisation : node compareFilesWithDiff.js fichier1.html fichier2.html
const [file1, file2] = process.argv.slice(2);

if (!file1 || !file2) {
    console.log("Usage : node compareFilesWithDiff.js <fichier1.html> <fichier2.html>");
} else {
    compareFiles(file1, file2);
}
