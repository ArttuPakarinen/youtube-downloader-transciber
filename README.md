This script downloads a youtube video and transscribes it's audio.

you need to create .env file with variables
    YOUTUBE_ID=<youtube id>
    OPENAI_API_KEY=<open ai API key>

Ensure yt-dlp is installed:
    yt-dlp --version

If yt-dlp is not installed, install it:
    sudo apt update
    sudo apt install yt-dlp

Ensure ffmpeg is installed:
    ffmpeg -version

If ffmpeg is not installed, install it:
    sudo apt update
    sudo apt install ffmpeg

Ensure Node.js is installed:
    node -v

If Node.js is not installed, install it:
    sudo apt install nodejs npm

Ensure that Node.js libraries are installed:
    npm install

Once all these checks and installations are done, you can run the script without issues:
    sh ./script.sh
