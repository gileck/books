// read the epub folder files

const fs = require('fs');
const path = require('path');
const epubFolderPath = path.join(__dirname, 'output');
const epubFiles = fs.readdirSync(epubFolderPath);
const jsdom = require('jsdom');

const imagesPaths = [
    "index-15_1.png",
    "index-16_1.png",
    "index-17_1.png",
    "index-20_1.png",
    "index-21_1.png",
    "index-25_1.png",
    "index-25_2.png",
    "index-26_1.png",
    "index-28_1.png",
    "index-28_2.png",
    "index-29_1.png",
    "index-29_2.png",
    "index-32_1.png",
    "index-35_1.png",
    "index-37_1.jpg",
    "index-39_1.png",
    "index-39_2.png",
    "index-46_1.jpg",
    "index-47_1.png",
    "index-49_1.png",
    "index-50_1.png",
    "index-55_1.png",
    "index-57_1.jpg",
    "index-58_1.png",
    "index-61_1.png",
    "index-64_1.png",
    "index-65_1.png",
    "index-66_1.png",
    "index-66_2.png",
    "index-66_3.png",
    "index-66_4.png",
    "index-66_5.png",
    "index-70_1.jpg",
    "index-70_2.png",
    "index-74_1.png",
    "index-75_1.png",
    "index-77_1.png",
    "index-78_1.jpg",
    "index-78_2.jpg",
    "index-80_1.jpg",
    "index-81_1.png",
    "index-82_1.png",
    "index-89_1.png",
    "index-95_1.png",
    "index-95_2.png",
    "index-95_3.png",
    "index-96_1.png",
    "index-97_1.png",
    "index-99_1.png",
    "index-101_1.png",
    "index-101_2.png",
    "index-101_3.png",
    "index-101_4.png",
    "index-101_5.png",
    "index-104_1.png",
    "index-104_2.png",
    "index-104_3.png",
    "index-107_1.png",
    "index-107_2.png",
    "index-108_1.png",
    "index-108_2.png",
    "index-108_3.png",
    "index-110_1.png",
    "index-111_1.png",
    "index-115_1.png",
    "index-116_1.png",
    "index-118_1.png",
    "index-121_1.png",
    "index-121_2.png",
    "index-125_1.png",
    "index-125_2.png",
    "index-126_1.png",
    "index-128_1.png",
    "index-129_1.png",
    "index-129_2.png",
    "index-130_1.png",
    "index-130_2.png",
    "index-130_3.png",
    "index-130_4.png",
    "index-130_5.png",
    "index-131_1.png",
    "index-136_1.png",
    "index-136_2.png",
    "index-137_1.png",
    "index-140_1.png",
    "index-140_2.png",
    "index-140_3.jpg",
    "index-141_1.png",
    "index-141_2.png",
    "index-141_3.png",
    "index-143_1.png",
    "index-144_1.png",
    "index-145_1.jpg",
    "index-146_1.png",
    "index-147_1.png",
    "index-147_2.png",
    "index-147_3.png",
    "index-147_4.png",
    "index-148_1.png",
    "index-151_1.png",
    "index-151_2.png",
    "index-152_1.png",
    "index-153_1.png",
    "index-161_1.png",
    "index-164_1.png",
    "index-164_2.png",

]

function readEpubFiles(epubFiles) {

    const images = {}
    let imagesIndex = 1
    imagesPaths.forEach((name) => {
        images[`Image ${imagesIndex}`] = name
        imagesIndex++
    });
    console.log(images);
    fs.writeFileSync(path.join(__dirname, './images.json'), JSON.stringify(images, null, 2), 'utf-8');
}

readEpubFiles(epubFiles);

