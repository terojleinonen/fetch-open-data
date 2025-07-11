import fs from 'fs';
import path from 'path';
import Request from '../src/app/components/request.js'; // Adjust path as necessary

const DATA_DIR = path.join(process.cwd(), 'src', 'app', 'data'); // process.cwd() gives the root of the project

async function backupData() {
  const endpoints = ['villains', 'shorts', 'books'];
  const backupPromises = endpoints.map(async (endpoint) => {
    try {
      console.log(`[INFO] Backup: Fetching data for ${endpoint}...`);
      const response = await Request(endpoint);
      if (response.error) {
        console.error(`[ERROR] Backup: Failed to fetch data for ${endpoint}: ${response.error}`);
        return;
      }
      if (!response || !response.data) {
        console.error(`[ERROR] Backup: No data received for ${endpoint}.`);
        return;
      }

      const filePath = path.join(DATA_DIR, `${endpoint}.json`);
      fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
      console.log(`[INFO] Backup: Successfully backed up ${endpoint} to ${filePath}`);
    } catch (error) {
      console.error(`[ERROR] Backup: Error processing ${endpoint}: ${error.message}`, error);
    }
  });

  await Promise.all(backupPromises);
  console.log('[INFO] Backup: Data backup process completed.');
}

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

backupData();
