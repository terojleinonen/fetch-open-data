import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADAPTATIONS_JSON_PATH = path.join(__dirname, '../src/app/data/adaptations.json');

// Helper function to fetch URL content
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirects
        console.log(`Redirected from ${url} to ${res.headers.location}`);
        fetchUrl(new URL(res.headers.location, url).href).then(resolve).catch(reject); // Ensure new URL is absolute
        return;
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Failed to fetch ${url}, status code: ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  let adaptationsData = [];
  try {
    const rawData = fs.readFileSync(ADAPTATIONS_JSON_PATH, 'utf-8');
    adaptationsData = JSON.parse(rawData);
    console.log(`Loaded ${adaptationsData.length} adaptations from JSON.`);
  } catch (err) {
    console.error('Could not read existing adaptations.json. Exiting.', err);
    return;
  }

  for (const adaptation of adaptationsData) {
    if (adaptation.adaptationLink && adaptation.adaptationLink.includes('en.wikipedia.org/wiki/')) {
      try {
        console.log(`Fetching details for: ${adaptation.adaptationTitle} from ${adaptation.adaptationLink}`);
        const adaptationPageHtml = await fetchUrl(adaptation.adaptationLink);
        const $ = cheerio.load(adaptationPageHtml);

        let posterUrl = null;

        // Preferred method: image within the infobox specifically marked as cover or poster
        $('table.infobox tr').each((i, tr_el) => {
            const th = $(tr_el).find('th');
            if (th.text().toLowerCase().includes('cover') || th.text().toLowerCase().includes('poster')) {
                const imgEl = $(tr_el).find('td img.mw-file-element').first();
                if (imgEl.length) {
                    let src = imgEl.attr('src');
                     if (src && !src.startsWith('//upload.wikimedia.org/wikipedia/commons/thumb/e/ea/A_blank_slate.png')) {
                        if (src.startsWith('//')) src = `https:${src}`;
                        posterUrl = src;
                        return false; // Found it
                    }
                }
            }
        });

        // Fallback 1: Any image directly in infobox (common for film posters)
        if (!posterUrl) {
            $('table.infobox').find('img.mw-file-element').each((idx, imgEl) => {
                let src = $(imgEl).attr('src');
                if (src && !src.startsWith('//upload.wikimedia.org/wikipedia/commons/thumb/e/ea/A_blank_slate.png')) { // Exclude placeholder
                    if (src.startsWith('//')) src = `https:${src}`;
                    posterUrl = src;
                    return false;
                }
            });
        }

        // Fallback 2: Main page image if it's a direct link to an image file (less common for posters)
        // This often picks up logos or other non-poster images, so it's less reliable
        if (!posterUrl) {
            $('a.image img').not('table.infobox img').each((idx, imgEl) => { // Exclude infobox images already checked
                let src = $(imgEl).attr('src');
                if (src && !src.includes('Speaker_Icon.svg') &&
                    !src.includes('Commons-logo.svg') &&
                    !src.includes('Wikidata-logo.svg') &&
                    !src.includes('Ambox_style.png') && // often for maintenance templates
                    !src.startsWith('//upload.wikimedia.org/wikipedia/commons/thumb/e/ea/A_blank_slate.png') &&
                    (src.match(/\.(jpg|jpeg|png)$/i) || src.includes('poster'))) { // Heuristic for poster-like images

                    if (src.startsWith('//')) src = `https:${src}`;

                    // Check if the image is likely a poster by looking at its parent link's title or class
                    const parentLink = $(imgEl).closest('a.image');
                    if (parentLink.length && parentLink.attr('href').toLowerCase().includes('file:')) {
                        const fileName = parentLink.attr('href').toLowerCase();
                        if (fileName.includes('poster') || fileName.includes('cover') || fileName.includes(adaptation.adaptationTitle.replace(/ /g, '_').toLowerCase())) {
                           posterUrl = src;
                           return false; // Found a likely candidate
                        }
                    }
                }
            });
        }

        if (posterUrl) {
          adaptation.posterUrl = posterUrl;
          console.log(`  Found and set poster for ${adaptation.adaptationTitle}: ${posterUrl}`);
        } else {
          console.log(`  No poster found for ${adaptation.adaptationTitle}`);
        }
      } catch (err) {
        console.error(`  Error processing ${adaptation.adaptationTitle} (${adaptation.adaptationLink}): ${err.message}`);
      }
    } else {
      // console.log(`Skipping ${adaptation.adaptationTitle}, no valid Wikipedia link.`);
    }
  }

  fs.writeFileSync(ADAPTATIONS_JSON_PATH, JSON.stringify(adaptationsData, null, 2));
  console.log('Finished processing. Updated adaptations.json with poster URLs where found.');

  // Clean up any old debug file if it exists
  const debugFilePath = path.join(__dirname, 'wiki_debug.html');
  if (fs.existsSync(debugFilePath)) {
      fs.unlinkSync(debugFilePath);
      console.log('Cleaned up temporary wiki_debug.html.');
  }
}

main();
