## To run (for local development):

1. `npm install`
2. `npm run dev`
3. Open localhost

## To build for extension:

1. `npm run build`

The extension files will be in `dist` folder.

## To use the extension:

- Open Chrome
- From settings, go to `Extensions -> Manage Extensions`
- Click `Load unpacked` and select the `dist` folder in this project
- If the extension loaded successfully, you should see `Kaveri Bot` in your extensions list.
- Go to `kaveri.karnataka.gov.in` and you'll see the bot.

## To create a new release of the extension (zip file):

- Go to `Actions` in the Github repo for `kaveribot`
- From the left sidebar, click on "Build and release Kaveribot Extension"
- On the right, click on the "Run workflow" button
- In the "Branch to build extension from" field, type the name of the branch. Leave it as `main` if you're not sure or if you want to build latest.
- In the `Release version` field, type a version number. (semver protocol)
- Click "Run workflow".

This will create a new release and the zip file will be inside the release. You can view the latest [releases here](https://github.com/zen-citizen/kaveribot/releases).
