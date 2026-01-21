const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_ICON = path.join(__dirname, '../release_assets/play_store_icon.png');
const RES_DIR = path.join(__dirname, '../android/app/src/main/res');

const CONFIG = [
    { density: 'mipmap-mdpi', size: 48 },
    { density: 'mipmap-hdpi', size: 72 },
    { density: 'mipmap-xhdpi', size: 96 },
    { density: 'mipmap-xxhdpi', size: 144 },
    { density: 'mipmap-xxxhdpi', size: 192 },
];

async function generateIcons() {
    if (!fs.existsSync(SOURCE_ICON)) {
        console.error('Source icon not found:', SOURCE_ICON);
        process.exit(1);
    }

    console.log('Generating icons from:', SOURCE_ICON);

    for (const config of CONFIG) {
        const outputDir = path.join(RES_DIR, config.density);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Generate standard square icon
        await sharp(SOURCE_ICON)
            .resize(config.size, config.size)
            .toFile(path.join(outputDir, 'ic_launcher.png'));

        console.log(`Generated ${config.density}/ic_launcher.png (${config.size}x${config.size})`);

        // Generate round icon
        // Create a circular mask
        const circleMask = Buffer.from(
            `<svg><circle cx="${config.size / 2}" cy="${config.size / 2}" r="${config.size / 2}" /></svg>`
        );

        await sharp(SOURCE_ICON)
            .resize(config.size, config.size)
            .composite([{
                input: circleMask,
                blend: 'dest-in'
            }])
            .toFile(path.join(outputDir, 'ic_launcher_round.png'));

        console.log(`Generated ${config.density}/ic_launcher_round.png (${config.size}x${config.size})`);
    }

    console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
