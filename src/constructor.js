const fs = require('fs');
const xml2js = require('xml2js');

// Name of JSON file where will be saved all created combinations
const CREATED_SVG = './src/createdSvg.json'

function nftConstructor(){
    /*
    * Create different svg pictures combination from different assets.
    * Returns path to the newly created svg picture.
    * */

    // Future JSON object
    let createdSvg = {
        name: "Svg combinations",
        svg: []
    }

    // Try to read data with already created combinations from JSON file
    try {
        createdSvg = JSON.parse( fs.readFileSync(CREATED_SVG, {encoding: "utf8"}));
    }catch (ENOENT){
        console.log(`File doesn\'t exist: ${CREATED_SVG}`);
    }

    // Creates random combination for new svg picture
    function getRandCombination(){
        let head = Math.floor(Math.random() * 6) + 1;
        let accessory = Math.floor(Math.random() * 6) + 1;
        return head.toString()+accessory.toString();
    }

    // Get the unique combination which wasn't used before
    let combination;
    do {
        combination=getRandCombination();
    }
    while (createdSvg.svg.includes(combination));


    // In this cycle we get all pathes from svg file.
    // We convert xml to json object and copy them to the 'pathes' variable.
    const parser = new xml2js.Parser();
    let pathes = new Array();
    for(let i=1; i<=combination.length; i++){
        parser.parseString(fs.readFileSync(`./src/assets/${i}/${combination[i-1]}.svg`, {encoding:'utf8', flag:'r'}), function (err, result){
            for(let k=0;k<result.svg.g[0].path.length; k++) {
                pathes.push(result.svg.g[0].path[k]);
            }
        })
    }

    // Here we merge all pathes and create an xml view of them
    let xml_pathes='';
    for(let i=0; i<pathes.length;i++) {
        xml_pathes += `<path id="${pathes[i]['$'].id}"
                    d="${pathes[i]['$'].d}"
                    stroke="${pathes[i]['$'].stroke}"
                    fill="${pathes[i]['$'].fill}"
                    fill-rule="${pathes[i]['$']['fill-rule']}"></path>`
    }

    // In this part ov code we create an xml stringify code
    let xml =
        `<svg
        name="man_${combination}"
        id="man_${combination}"
        version="1.2"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        width="400"
        height="400"
        viewBox="0, 0, 400, 400">
        <g id="svgg">
            ${xml_pathes.toString()}
        </g>
    </svg>`

    // Add combination to json file
    createdSvg.svg.push(combination);

    // Write xml code to svg file
    try {
        fs.writeFileSync(`./src/assets/created/man_${createdSvg.svg.length}.svg`,xml);
    }catch (e){
        console.log(`File can\'t be saved: man_${createdSvg.svg.length}.svg,\n${e.message}`);
    }

    // Save 'createdSvg' object with all created combination as JSON file
    try {
        fs.writeFileSync(CREATED_SVG, JSON.stringify(createdSvg) );
    }catch (e){
        console.log(`File can\'t be saved: ${CREATED_SVG},\n${e.message}`);
    }

    // Return created svg image
    return `./assets/created/man_${createdSvg.svg.length}.svg`;
}


module.exports = nftConstructor