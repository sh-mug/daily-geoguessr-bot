# GeoGuessr Daily Challenge Poster

(Japanese version is available [here](README_ja.md))

This project is a Node.js application that logs into GeoGuessr, creates a daily challenge, and posts the challenge details to a specified Discord channel. The project uses TypeScript for development and `discord.js` for interacting with the Discord API.

## Prerequisites

- Node.js
- npm
- A Discord bot token and a Discord channel ID
- A GeoGuessr account

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/sh-mug/daily-geoguessr-bot.git
    cd daily-geoguessr-bot
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Please copy `.env.example` to the root directory of the project to create a `.env` file and set the following environment variables.:
    ```plaintext
    GEOGUESSR_EMAIL=your-geoguessr-email@gmail.com
    GEOGUESSR_PASSWORD=your-geoguessr-password
    DISCORD_TOKEN=your-discord-bot-token
    DISCORD_CHANNEL_ID=your-discord-channel-id
    ```

4. Compile the TypeScript code:
    ```bash
    npx tsc
    ```

## Usage


### Standalone Mode

In standalone mode, scheduled tasks are automatically executed without any settings. To run in standalone mode, execute the following:

```bash
npm run standalone
```

In this mode, the following schedules are used:
- `challenge` runs every day at midnight (00:00) and creates a new GeoGuessr challenge.
- `highscores` runs every day at 11 PM (23:00) and posts the highscores of the previous day's challenge to Discord.

### Server Mode

In server mode, you can access the endpoints exposed by the Express server to manually execute tasks. To run in server mode, execute the following:

```bash
npm start
```

In this mode, the following endpoints are available:
- `GET /challenge` - Triggers `challenge`.
- `GET /highscores` - Triggers `highscores`.

### Crontab Configuration

If you prefer to use `crontab` to schedule tasks instead of running the application in standalone mode, you can set up `crontab` entries as follows:

1. Open the crontab editor:

    ```bash
    crontab -e
    ```

2. Add the following entries to schedule `challenge` and `highscores`:

    ```crontab
    0 0 * * * curl http://localhost:25000/challenge
    0 23 * * * curl http://localhost:25000/highscores
    ```

## Project Structure

- `src/`
  - `geoguessr-api/`
    - `login.ts` - Handles logging into GeoGuessr and managing cookies.
    - `challenge.ts` - Handles creating a new GeoGuessr challenge.
    - `highscores.ts` - Handles fetching the highscores of a GeoGuessr challenge.
  - `discord/`
    - `discordPoster.ts` - Handles posting messages to Discord.
  - `server.ts` - The entry point of the application.

## Environment Variables

- `GEOGUESSR_EMAIL`: Your GeoGuessr account email.
- `GEOGUESSR_PASSWORD`: Your GeoGuessr account password.
- `DISCORD_TOKEN`: Your Discord bot token.
- `DISCORD_CHANNEL_ID`: The ID of the Discord channel where the message will be posted.

## Important Notes

- Ensure that your bot has the necessary permissions to post messages in the specified Discord channel.
- Be cautious with your credentials and avoid committing the `.env` file to version control.
- Save the GeoGuessr cookie to `cookie.txt` during the initial login. The cookie is valid for one year. When it expires, manually delete `cookie.txt`.
- To get challenge results, the creator must play the challenge daily due to GeoGuessr's API specifications.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any questions or support, please open an issue in the GitHub repository.
