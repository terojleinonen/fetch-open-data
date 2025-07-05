import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/List_of_adaptations_of_works_by_Stephen_King';
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'app', 'data', 'adaptations.json');

// Ensure the directory exists
const OUTPUT_DIR = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to get text, prioritizing specific tags if available
const getCellText = (cellCheerio, $) => {
    if (!cellCheerio) return '';
    // Try to get text from an italicized link first, then any link, then italics, then direct text
    let text = cellCheerio.find('i a').text().trim();
    if (text) return text;
    text = cellCheerio.find('a').first().text().trim();
    if (text) return text;
    text = cellCheerio.find('i').first().text().trim();
    if (text) return text;
    return cellCheerio.text().trim();
};

// More specific text extraction for adaptation title (often in italics or a link within italics)
const getAdaptationTitle = (cellCheerio, $) => {
    if (!cellCheerio) return '';
    // Check for <a> inside <i>
    let title = cellCheerio.find('i').find('a').text().trim();
    if (title) return title;
    // Check for <i> directly
    title = cellCheerio.find('i').text().trim();
    if (title) return title;
    // Fallback to any <a> tag
    title = cellCheerio.find('a').text().trim();
    if (title) return title;
    // Final fallback to the whole cell's text if no specific tags found
    return cellCheerio.text().trim();
};


const parseNotesAndOriginalWork = (notesCellCheerio, $, adaptationTitle) => {
    const notesText = notesCellCheerio.text(); // Full text for keyword searching
    let originalWorkTitle = '';
    let originalWorkType = '';

    // Pattern: "Based on the [type] "[Work Title]""
    const explicitMatch = notesText.match(/Based on the (novel|short story|novella|series|story) "([^"]+)"/i);
    if (explicitMatch && explicitMatch[2]) {
        originalWorkTitle = explicitMatch[2].trim();
        originalWorkType = explicitMatch[1].charAt(0).toUpperCase() + explicitMatch[1].slice(1);
        if (originalWorkType === 'Story') originalWorkType = 'Short Story';
    } else {
        // Pattern: "Based on the [type] of the same name"
        const sameNameMatch = notesText.match(/Based on the (novel|short story|novella) of the same name/i);
        if (sameNameMatch) {
            originalWorkTitle = adaptationTitle; // Assume adaptation title is the same as work title
            originalWorkType = sameNameMatch[1].charAt(0).toUpperCase() + sameNameMatch[1].slice(1);
        } else {
            // Fallback: Look for any link in the notes cell as a potential work title
            // This is less reliable and should be a last resort
            const linkInNotes = notesCellCheerio.find('a').first();
            if (linkInNotes.length > 0) {
                originalWorkTitle = linkInNotes.text().trim();
                // Try to infer type from surrounding text if title came from a generic link
                if (notesText.toLowerCase().includes('novel')) originalWorkType = 'Novel';
                else if (notesText.toLowerCase().includes('short story')) originalWorkType = 'Short Story';
                else if (notesText.toLowerCase().includes('novella')) originalWorkType = 'Novella';
                else if (notesText.toLowerCase().includes('series')) originalWorkType = 'Series';
            }
        }
    }

    // If originalWorkTitle is still blank, or suspicious (e.g. "Yes"), log warning
    if (!originalWorkTitle || originalWorkTitle.toLowerCase() === 'yes' || originalWorkTitle.toLowerCase() === 'no') {
        console.warn(`Suspicious/missing originalWorkTitle from notes: "${notesText}" for adaptation "${adaptationTitle}". Title found: "${originalWorkTitle}"`);
        if (originalWorkTitle.toLowerCase() === 'yes' || originalWorkTitle.toLowerCase() === 'no') originalWorkTitle = ''; // Discard "Yes"/"No"
    }

    return { originalWorkTitle, originalWorkType };
};


const parseGenericAdaptationTable = (table, $, adaptationTypeCategory) => {
    const adaptations = [];
    const rows = $(table).find('tbody tr').toArray();
    console.log(`Parsing table for category: ${adaptationTypeCategory}. Rows found: ${rows.length}`);

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header row
        const columns = $(rows[i]).find('td').toArray();
        if (columns.length < 3) { // Year, Title, Notes are minimum
            console.warn(`Skipping row ${i} in ${adaptationTypeCategory}: Not enough columns (${columns.length})`);
            continue;
        }

        const year = getCellText($(columns[0]), $);
        const adaptationTitleCell = $(columns[1]);
        const adaptationTitle = getAdaptationTitle(adaptationTitleCell, $);

        // Notes column is typically 3rd (index 2) or 4th (index 3)
        // For "Other film adaptations", it's usually index 2 (3rd column)
        // For "Other TV adaptations", it's usually index 1 (2nd actual data column if year is 0, title 1, notes 2)
        // Let's try to be more specific based on table structure.
        // The "Other film adaptations" table has Year | Title | Director | Notes | Rotten Tomatoes
        // The "Other TV adaptations" table has Year | Title | Notes | Distributor | Network | Rotten Tomatoes
        let notesCell;
        if (adaptationTypeCategory === 'Film') {
            if (columns.length > 3) notesCell = $(columns[3]); // Director is columns[2]
            else if (columns.length > 2) notesCell = $(columns[2]); // If director column is missing
            else {
                 console.warn(`Skipping row in Film: Not enough columns for Notes. Columns: ${columns.length}, Row content: ${$(rows[i]).text()}`);
                 continue;
            }
        } else if (adaptationTypeCategory === 'Television') {
             if (columns.length > 2) notesCell = $(columns[2]);
             else {
                console.warn(`Skipping row in TV: Not enough columns for Notes. Columns: ${columns.length}, Row content: ${$(rows[i]).text()}`);
                continue;
             }
        } else {
            console.warn(`Unknown adaptationTypeCategory: ${adaptationTypeCategory}`);
            continue;
        }

        if (!notesCell || notesCell.length === 0) {
            console.warn(`Skipping row in ${adaptationTypeCategory} (Title: ${adaptationTitle}): Notes cell not found or empty.`);
            continue;
        }

        const { originalWorkTitle, originalWorkType } = parseNotesAndOriginalWork(notesCell, $, adaptationTitle);
        let type = adaptationTypeCategory; // Default to category

        const notesTextContent = notesCell.text().toLowerCase();
        if (notesTextContent.includes('miniseries')) type = 'Miniseries';
        else if (notesTextContent.includes('tv series') || notesTextContent.includes('television series')) type = 'TV Series';
        else if (notesTextContent.includes('episode of the anthology series')) type = 'TV Episode (Anthology)';
        // Retain Film or Television if not more specific.

        if (adaptationTitle && year && originalWorkTitle && adaptationTitle.toLowerCase() !== 'yes' && adaptationTitle.toLowerCase() !== 'no') {
            adaptations.push({
                adaptationTitle,
                year,
                type,
                originalWorkTitle,
                originalWorkType,
            });
        } else {
            console.warn(`Skipped adaptation due to missing critical info: Title='${adaptationTitle}', Year='${year}', OriginalWork='${originalWorkTitle}'`);
        }
    }
    return adaptations;
};

const parseSKInvolvementTable = (table, $, adaptationTypeCategory) => {
    const adaptations = [];
    const rows = $(table).find('tbody tr').toArray();
    console.log(`Parsing SK Involvement table for category: ${adaptationTypeCategory}. Rows found: ${rows.length}`);

    for (let i = 1; i < rows.length; i++) { // Skip header
        const columns = $(rows[i]).find('td').toArray();
        // Year | Title | Writer | Actor | Role | Notes
        if (columns.length < 6) {
            console.warn(`Skipping row ${i} in SK Involvement ${adaptationTypeCategory}: Not enough columns (${columns.length})`);
            continue;
        }

        const year = getCellText($(columns[0]), $);
        const adaptationTitle = getAdaptationTitle($(columns[1]), $); // Title is in the second column
        const notesCell = $(columns[5]); // Notes is the 6th column

        const { originalWorkTitle, originalWorkType } = parseNotesAndOriginalWork(notesCell, $, adaptationTitle);
        let type = adaptationTypeCategory; // Default to category

        const notesTextContent = notesCell.text().toLowerCase();
        if (notesTextContent.includes('miniseries')) type = 'Miniseries';
        else if (notesTextContent.includes('tv series') || notesTextContent.includes('television series')) type = 'TV Series';
         else if (adaptationTypeCategory === 'Film' && notesTextContent.includes('original work for the film')) {
            // This is an original screenplay by King, but we are looking for adaptations *of his works*
            // If originalWorkTitle is empty here, it means it's likely an original screenplay.
            if (!originalWorkTitle) {
                console.log(`Skipping original screenplay: ${adaptationTitle} (Film)`);
                continue;
            }
        }


        if (adaptationTitle && year && originalWorkTitle && adaptationTitle.toLowerCase() !== 'yes' && adaptationTitle.toLowerCase() !== 'no') {
            adaptations.push({
                adaptationTitle,
                year,
                type,
                originalWorkTitle,
                originalWorkType,
            });
        } else {
             console.warn(`Skipped SK involvement adaptation due to missing info: Title='${adaptationTitle}', Year='${year}', OriginalWork='${originalWorkTitle}'`);
        }
    }
    return adaptations;
};


async function scrapeAndSave() {
    console.log('Fetching Wikipedia page...');
    const response = await fetch(WIKIPEDIA_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    console.log('Parsing content...');
    let allAdaptations = [];

    // Films
    const filmsHeading = $('#Films').parent(); // h2#Films
    // Table 1: "Adaptations with Stephen King's involvement" (Films)
    const skFilmsTable = filmsHeading.nextAll('table.wikitable').eq(0);
    if (skFilmsTable.length) {
        console.log('Parsing "Adaptations with Stephen King\'s involvement (Films)" table...');
        allAdaptations = allAdaptations.concat(parseSKInvolvementTable(skFilmsTable, $, 'Film'));
    } else {
        console.warn('Could not find "Adaptations with Stephen King\'s involvement (Films)" table.');
    }

    // Table 2: "Other film adaptations"
    const otherFilmsTable = filmsHeading.nextAll('table.wikitable').eq(1);
    if (otherFilmsTable.length) {
        console.log('Parsing "Other film adaptations" table...');
        allAdaptations = allAdaptations.concat(parseGenericAdaptationTable(otherFilmsTable, $, 'Film'));
    } else {
        console.warn('Could not find "Other film adaptations" table.');
    }

    // Television
    const tvHeading = $('#Television').parent(); // h2#Television
    // Table 1: "Adaptations with Stephen King's involvement" (TV)
    const skTvTable = tvHeading.nextAll('table.wikitable').eq(0);
    if (skTvTable.length) {
        console.log('Parsing "Adaptations with Stephen King\'s involvement (TV)" table...');
        allAdaptations = allAdaptations.concat(parseSKInvolvementTable(skTvTable, $, 'Television'));
    } else {
        console.warn('Could not find "Adaptations with Stephen King\'s involvement (TV)" table.');
    }

    // Table 2: "Other TV adaptations"
    const otherTvTable = tvHeading.nextAll('table.wikitable').eq(1);
    if (otherTvTable.length) {
        console.log('Parsing "Other TV adaptations" table...');
        allAdaptations = allAdaptations.concat(parseGenericAdaptationTable(otherTvTable, $, 'Television'));
    } else {
        console.warn('Could not find "Other TV adaptations" table.');
    }

    // Remove duplicates based on adaptationTitle, year, and originalWorkTitle (more robust)
    const uniqueAdaptations = allAdaptations.filter((adaptation, index, self) =>
        index === self.findIndex((a) => (
            a.adaptationTitle === adaptation.adaptationTitle &&
            a.year === adaptation.year &&
            a.originalWorkTitle === adaptation.originalWorkTitle &&
            a.type === adaptation.type // Added type to differentiate Film vs TV of same name/year
        ))
    );

    console.log(`Found ${uniqueAdaptations.length} unique adaptations after filtering.`);

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(uniqueAdaptations, null, 2));
    console.log(`Adaptations data saved to ${OUTPUT_PATH}`);
}

scrapeAndSave().catch(error => {
    console.error('Error during scraping or saving:', error);
    process.exit(1);
});
