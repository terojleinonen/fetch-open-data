export default async function Request(parameter, options = {}) {
    // GOOGLE_BOOKS_API_KEY is no longer used directly here.
    let baseUrl = 'https://stephen-king-api.onrender.com/api/';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    let data;

    // All requests will now go to the external API, as adaptations.json is directly imported.
    // The special handling for 'adaptations' parameter to use a local API route is removed.
    // console.log(`[INFO] Request: Initiating for parameter: "${parameter}"`);

    const finalUrl = baseUrl + parameter;
    // console.log(`[INFO] Request: Attempting to fetch from finalUrl: ${finalUrl}`);

    try {
      const response = await fetch(finalUrl, headers);
      // console.log(`[INFO] Request: Response status for "${finalUrl}": ${response.status}`);
      if (!response.ok) {
        console.error(`[ERROR] Request: API error for "${parameter}" from URL "${finalUrl}": Status ${response.status}, StatusText: ${response.statusText}`);
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await response.json();
      // console.log(`[INFO] Request: Primary API data received for "${parameter}"`);

      // Google Books integration removed.
      // Fallback for cover images if they were previously reliant on Google Books:
      // Ensure that items in data.data have coverImageUrl and largeCoverImageUrl,
      // or they are handled by the component displaying them.
      // Based on the previous logic, if Google Books failed, it would set them to "NO_COVER_AVAILABLE".
      // We need to ensure this or a similar fallback is present if the primary API doesn't provide them.

      if (data && data.data) {
        const itemsToProcess = Array.isArray(data.data) ? data.data : [data.data];
        itemsToProcess.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            if (!item.coverImageUrl) {
              item.coverImageUrl = "NO_COVER_AVAILABLE";
            }
            if (!item.largeCoverImageUrl) {
              item.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            }
            // Ensure other fields potentially augmented by Google Books are gracefully handled
            // by components if they are missing from the primary API data.
            // For example, fields like subtitle, authors, publisher, publishedDate, description,
            // pageCount, categories, averageRating, ratingsCount, language, infoLink, previewLink.
            // The primary API should be the source of truth for these, or components should
            // handle their absence.
          }
        });
      }

    } catch (err) {
      console.error(`[ERROR] Request: Top-level error for "${parameter}": ${err.message}`, err);
      return { data: null, error: err.message }; // Ensure a consistent error structure
    }
    // console.log(`[INFO] Request: Finished for "${parameter}"`);
    return data;
}