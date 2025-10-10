// scrapeAndImport.js

const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

// --- IMPORTANT ---
// MAKE SURE YOUR MONGO ATLAS CONNECTION STRING IS PASTED HERE
const dbURI = 'mongodb+srv://nexagen0_db_user:rotimait@cluster0.gqlaccx.mongodb.net/annapurna?retryWrites=true&w=majority&appName=Cluster0';

// --- DO NOT EDIT BELOW THIS LINE ---

// Import your Mongoose models
const Disease = require('./models/Disease'); 
const Symptom = require('./models/Symptom');

// --- Advanced Web Scraping Functions ---

async function getDiseaseLinks() {
    try {
        console.log("Fetching disease links from Mayo Clinic's A-Z list...");
        const url = 'https://www.mayoclinic.org/diseases-conditions/index?letter=A';
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);
        const links = [];
        $('div.index ul li a').each((i, element) => {
            const href = $(element).attr('href');
            if (href) links.push(`https://www.mayoclinic.org${href}`);
        });
        console.log(`Found ${links.length} disease links.`);
        return links;
    } catch (error) {
        console.error("❌ Error fetching disease links:", error.message);
        return [];
    }
}

async function scrapeDiseasePage(url) {
    try {
        const { data } = await axios.get(url, {
             headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);
        
        const diseaseData = {};
        diseaseData.name = $('h1').text().trim();
        
        const symptomsList = [];
        // This selector specifically finds the H2 tag with "Symptoms" and extracts all list items that follow it
        $('h2:contains("Symptoms")').first().nextUntil('h2', 'ul').find('li').each((i, element) => {
            const symptomText = $(element).text().trim().replace(/\s\s+/g, ' ');
            symptomsList.push(symptomText);
        });
        
        if (symptomsList.length > 0) {
            diseaseData.symptoms = symptomsList;
            console.log(`- Scraped "${diseaseData.name}" with ${symptomsList.length} symptoms.`);
            return diseaseData;
        } else {
            console.log(`- Skipping "${diseaseData.name}" (no symptoms found).`);
            return null; // Skip diseases where no symptoms could be found
        }
    } catch (error) {
        console.error(`❌ Error scraping ${url}: ${error.message}`);
        return null;
    }
}


// --- Main Execution and Database Import Logic ---

const run = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('✅ MongoDB connected for ADVANCED data import...');

        // 1. Scrape the data
        const diseaseLinks = await getDiseaseLinks();
        if (diseaseLinks.length === 0) return;

        const allDiseasesData = [];
        // Let's scrape the first 30 diseases to get a good amount of data
        for (const link of diseaseLinks.slice(0, 30)) { 
            const data = await scrapeDiseasePage(link);
            if (data) allDiseasesData.push(data); // Only add if data was successfully scraped
        }
        console.log(`\n✅ Successfully scraped detailed data for ${allDiseasesData.length} diseases.`);

        // 2. Clear existing data
        console.log("Clearing old data from database...");
        await Disease.deleteMany({});
        await Symptom.deleteMany({});
        console.log("✅ Database cleared.");

        // 3. Import new, structured data
        console.log("Importing new data with symptom relationships...");
        
        const allSymptomNames = new Set();
        allDiseasesData.forEach(d => d.symptoms.forEach(s => allSymptomNames.add(s)));

        const symptomDocs = Array.from(allSymptomNames).map(name => ({ name }));
        const createdSymptoms = await Symptom.insertMany(symptomDocs);
        console.log(`- ${createdSymptoms.length} unique symptoms imported.`);

        const symptomMap = new Map();
        createdSymptoms.forEach(s => symptomMap.set(s.name, s._id));

        const diseaseDocs = allDiseasesData.map(disease => ({
            name: disease.name,
            symptoms: disease.symptoms.map(sName => symptomMap.get(sName)).filter(id => id)
        }));
        
        const createdDiseases = await Disease.insertMany(diseaseDocs);
        console.log(`- ${createdDiseases.length} diseases with linked symptoms imported.`);
        
        console.log("\n🎉 Advanced scraping and import process completed successfully!");

    } catch (error) {
        console.error("\n❌ An error occurred during the process:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
};

run();