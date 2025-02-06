import { readdirSync, statSync, readFileSync, createWriteStream, unlinkSync } from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { join, resolve } from 'path';

// Funzione per cercare ricorsivamente i file .html
function getHtmlFiles(folderPath) {
  let results = [];

  // Ottieni tutti i file e le cartelle all'interno della directory
  const files = readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = join(folderPath, file);
    const stat = statSync(filePath);

    // Se è una directory, esegui la ricerca ricorsiva
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      // Se è un file .html, aggiungilo ai risultati
      results.push(filePath);
    }
  });

  return results;
}

// Funzione per estrarre i contenuti dei tag <mat-icon>
function extractMatIconTexts(folderPath) {
  try {
    // Ottieni tutti i file .html ricorsivamente
    const files = getHtmlFiles(folderPath);

    let texts = [
      'star',
      'message',
      'gavel',
      'swap_vert',
      'home',
      'groups_3',
      'emoji_events',
      'sports_soccer',
      'account_circle',
      'exit_to_app',
      'input',
    ];

    // Leggi ogni file HTML
    files.forEach((filePath) => {
      const content = readFileSync(filePath, 'utf-8');

      // Regex per estrarre il testo dai tag <mat-icon>
      const regex_mat_icon = /<mat-icon[^>]*>(.*?)<\/mat-icon[^>]*>/gi;
      const regex_empty_state = /<app-mat-empty-state[^>]* icon="(.*?)"[^>]*\/>/gi;

      let match;

      // Trova tutte le occorrenze dei tag <mat-icon>
      while (
        (match = regex_mat_icon.exec(content)) !== null ||
        (match = regex_empty_state.exec(content)) !== null
      ) {
        if (!match[1].trim().startsWith('{{')) {
          if (match[1].indexOf('{{') > -1) {
            const regex = /{{[^>]* \? '(.*?)'[^>]*}}/gi;

            let match2;
            while ((match2 = regex.exec(match[1])) !== null) {
              texts.push(match[1].substring(0, match[1].indexOf('{{')) + match2[1].trim());
            }
          } else {
            texts.push(match[1].trim());
          }
        }
      }
    });

    // Rimuovi i duplicati usando un Set
    const uniqueTexts = [...new Set(texts)];

    // Restituisci i testi uniti da una virgola
    return uniqueTexts.sort().join(',');
  } catch (err) {
    console.error("Errore durante l'elaborazione dei file:", err);
  }
}

// Esegui la funzione con il percorso della cartella
const folderPath = process.argv[2] || './'; // Usa la cartella corrente se non viene specificata una cartella
const result = extractMatIconTexts(folderPath);

if (result) {
  const url =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300..600,0..1,0&icon_names=';
  console.log(url + result);

  const css = await fetch(url + result);
  const content = await css.text();
  const regex_url =
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gi;
  const match = regex_url.exec(content);
  const font = await fetch(match[0]);
  const fontFilePath = join(
    resolve(folderPath, '../'),
    'public',
    'media',
    'material-symbols.woff2',
  );
  unlinkSync(fontFilePath);
  const fileStream = createWriteStream(fontFilePath, {
    flags: 'wx',
  });
  await finished(Readable.fromWeb(font.body).pipe(fileStream));
}
