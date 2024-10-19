const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Ladataan OpenAI API-avain .env-tiedostosta

// Hakee YOUTUBE_ID .env-tiedostosta
const YOUTUBE_ID = process.env.YOUTUBE_ID;

// Tarkistaa, että YOUTUBE_ID on määritetty
if (!YOUTUBE_ID) {
    console.error('YOUTUBE_ID ei ole määritetty .env-tiedostossa.');
    process.exit(1);
}

// Tiedostopolut
const directoryPath = path.join(__dirname, 'splitted_audio', YOUTUBE_ID);
const transcriptDir = path.join(__dirname, 'transcripts');
const transcriptFilePath = path.join(transcriptDir, `${YOUTUBE_ID}.txt`);

// Varmistetaan, että transcripts-hakemisto on olemassa
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

// Asynkroninen funktio, joka suorittaa transkription yhdelle tiedostolle ja lisää tuloksen tekstitiedostoon
async function transcribeAudio(filePath) {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        form.append('model', 'whisper-1'); // Säädä mallin nimeä tarvittaessa

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Lataa API-avain ympäristömuuttujista
                ...form.getHeaders(),
            },
        });

        const transcript = response.data.text;
        // console.log(`Transkriptio tiedostolle ${path.basename(filePath)}:`, transcript);

        // Tallenna transkriptio tiedostoon
        fs.appendFileSync(transcriptFilePath, `${transcript} `);
    } catch (error) {
        console.error(`Virhe transkription aikana tiedostolle ${path.basename(filePath)}:`, error.response ? error.response.data : error.message);
    }
}

// Lukee kaikki MP3-tiedostot hakemistosta ja ajaa transkription niille yksi kerrallaan
async function processFilesSequentially(files) {
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        await transcribeAudio(filePath);
    }
}

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Virhe luettaessa hakemistoa:', err);
        return;
    }

    // Suodatetaan vain .mp3 tiedostot ja järjestetään ne aakkosjärjestykseen
    const mp3Files = files.filter(file => path.extname(file) === '.mp3').sort();

    // Ajetaan transkriptio MP3-tiedostoille yksi kerrallaan järjestyksessä
    processFilesSequentially(mp3Files);
});
