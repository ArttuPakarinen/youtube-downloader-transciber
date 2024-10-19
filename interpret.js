const axios = require('axios');
const fs = require('fs');
require('dotenv').config(); // Ladataan OpenAI API-avain .env-tiedostosta

console.log("Aloitetaan tulkinta...");

// Hakee YOUTUBE_ID .env-tiedostosta
const YOUTUBE_ID = process.env.YOUTUBE_ID;

// Tarkistaa, että YOUTUBE_ID on määritetty
if (!YOUTUBE_ID) {
    console.error('YOUTUBE_ID ei ole määritetty .env-tiedostossa.');
    process.exit(1);
}

// Määritä tiedostopolku transkriptiolle
const transcriptFilePath = `./transcripts/${YOUTUBE_ID}.txt`;

// Tulkinnan tiedostopolku
const interpretationFilePath = `./interpretation/${YOUTUBE_ID}_interpretation.txt`;

// Lue transkriptio tiedostosta
fs.readFile(transcriptFilePath, 'utf8', async (err, data) => {
    if (err) {
        console.error(`Virhe luettaessa transkriptiotiedostoa: ${err}`);
        return;
    }
    // console.log("data",data)
    // Lähetä transkriptio ChatGPT API:lle
    try {
        const instruction = 'Datassa on englanninkielinen transcriptio, josta haluan että teet blogikirjoituksen. Tee blogikirjoitus kuin itse puhuisit samat asiat kuin transcriptiossa. Jaa asiat kappaleisiin ja tee kirjoitus suomeksi.';
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Käytettävä malli
                messages: [
                    { role: 'system', content: instruction },
                    { role: 'user', content: data }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // API-avain .env-tiedostosta
                    'Content-Type': 'application/json'
                }
            }
        );
        const interpretation = response.data.choices[0].message.content;
        // console.log('ChatGPT:n tulkinta:', interpretation);

        fs.writeFileSync(interpretationFilePath, interpretation);
        console.log(`Tulkinta tallennettu tiedostoon: ${interpretationFilePath}`);
    } catch (error) {
        console.error(`Virhe lähettäessä pyyntöä ChatGPT:lle: ${error.response ? error.response.data : error.message}`);
    }
});
