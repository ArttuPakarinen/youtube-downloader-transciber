Tässä ovat komennot, jotka kannattaa suorittaa että voit ajaa script.sh

Varmista yt-dlp asennus:
    yt-dlp --version

Jos yt-dlp ei ole asennettuna, asenna se:
    sudo apt update
    sudo apt install yt-dlp

Varmista ffmpeg asennus:
    ffmpeg -version

Jos ffmpeg ei ole asennettuna, asenna se:
    sudo apt update
    sudo apt install ffmpeg

Varmista, että Node.js on asennettuna:
    node -v

Jos Node.js ei ole asennettuna, asenna se:
    sudo apt install nodejs npm

Tarkista, että .env-tiedosto on olemassa ja sisältää tarvittavan YOUTUBE_ID-arvon:
    cat .env

Tämä varmistaa, että skripti pystyy lukemaan YOUTUBE_ID oikein.

Jos haluat että scripti osaa tekstittää youtube sisällön, sinun pitää hankkia OPEN AI:lta API avain, ja lisätä se .env tiedostoon:
    OPENAI_API_KEY=XXXX

Varmista, että Node.js-kirjastot ovat asennettuna
    npm install

Kun kaikki nämä tarkistukset ja tarvittavat asennukset on suoritettu, voit ajaa skriptin ongelmitta.
    sh ./script.sh