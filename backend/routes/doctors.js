const express = require('express');
const axios = require('axios');
const router = express.Router();

// In-memory cache to store results.
const cache = {};
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

router.get('/', async (req, res) => {
  const { specialty, location = 'delhi' } = req.query;
  const apiKey = process.env.APIFY_API_TOKEN;

  if (!specialty) {
    return res.status(400).json({ message: 'Specialty is a required query parameter.' });
  }

  if (!apiKey) {
    console.error('CRITICAL ERROR: APIFY_API_TOKEN is not defined in your .env file.');
    return res.status(500).json({ message: 'API key is not configured on the server.' });
  }

  const cacheKey = `${specialty.toLowerCase().trim()}-${location.toLowerCase().trim()}`;
  const now = Date.now();

  // Check for a valid cache entry
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION_MS)) {
    console.log(`Returning cached data for: ${cacheKey}`);
    return res.json(cache[cacheKey].data);
  }

  console.log(`Fetching fresh data from Apify for: ${cacheKey}`);
  const apiUrl = `https://api.apify.com/v2/acts/easyapi~practo-doctor-scraper/run-sync-get-dataset-items?token=${apiKey}&location=${location}&specialty=${specialty}`;

  try {
    const response = await axios.get(apiUrl);
    const doctors = response.data;

    if (doctors && doctors.length > 0) {
        cache[cacheKey] = {
            timestamp: now,
            data: doctors,
        };
    }

    res.json(doctors);
  } catch (error) {
    // --- IMPROVED ERROR HANDLING ---
    if (error.response && error.response.status === 403) {
      console.error('CRITICAL ERROR: Apify API request failed with 403 Forbidden. This means your API token is invalid, expired, or does not have permission for this Actor.');
      return res.status(500).json({ message: 'Authentication with the doctor data provider failed. Please check the server logs.' });
    }

    console.error('Error fetching data from Apify:', error.message);

    if (cache[cacheKey]) {
      console.log(`API failed, returning stale cache for: ${cacheKey}`);
      return res.json(cache[cacheKey].data);
    }

    res.status(500).json({ message: 'Failed to fetch doctor information at the moment.' });
  }
});

module.exports = router;