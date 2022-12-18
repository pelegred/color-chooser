// Initialize canvas
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

// Grab subtitle (Showing x of total...) 
let indicator = document.querySelector("#indicator");

let output = document.querySelector("#output");


// Utility function - generate random color in hsla format
let getRandomColor = function() {
    let h = Math.floor(Math.random() * 360);
    let s = 25 + Math.floor(Math.random() * 50) // define range 25-75
    let l = 25 + Math.floor(Math.random() * 50) // define range 25-75
    return `hsla(${h},${s}%,${l}%,1)`;
}

// Draw the like image
function showIfLiked() {
    let likeImage = new Image();
    likeImage.src="./assets/like.png";
    if (sets[currentSet][sets[currentSet].length-1] == true) {
        likeImage.addEventListener("load",function() {
            ctx.drawImage(likeImage,20,20,50,50);
        });
    }
}

let listOfLiked = [];
function populateOutput() {
    output.value = listOfLiked;

}

// Declare global varaibles
let swatchCount = 4; // how many swatches
let setCount = 50;
let currentSet=0;
let cw = canvas.clientWidth;
let ch = canvas.clientWidth;

let sets = [];

function buildList() {
    // Build the list of colors "sets"
    for (let i = 0; i< setCount ; i+=1) {
        let set = [];
        for (let j = 0; j < swatchCount; j+=1) {
            set.push(getRandomColor());
        }
        set.push(false); // add another item to set array at the end to indicate if it's like or not - default value is not liked.
        sets.push(set);
    }
}
buildList();


// Paints current swatches set to the canvas
let showSwatches = function(currentSet,swatchCount) {
    for(let i = 0; i < swatchCount; i+=1) {
        ctx.fillStyle=sets[currentSet][i];
        ctx.fillRect((cw/swatchCount)*i,0,cw/swatchCount,ch);
    }
    indicator.innerHTML = `showing palette ${currentSet+1} out of ${setCount}`;
    showIfLiked();
    populateOutput();
}

showSwatches(currentSet,swatchCount);

// arrow navigation - rerun paint function while updating the currentSet dial
document.addEventListener("keydown", function(e) {
    if (e.key == "ArrowRight") {
        if (currentSet < setCount-1){
            currentSet += 1;
        } else {
            currentSet = 0;
        }
        showSwatches(currentSet,swatchCount);
    }
})

document.addEventListener("keydown", function(e) {
    if (e.key == "ArrowLeft") {
        if (currentSet > 0){
            currentSet += -1;
        } else {
            currentSet = setCount-1;
        }
        showSwatches(currentSet,swatchCount);
    }
})


// Generate button
let btnGenerate = document.querySelector("#generate");
btnGenerate.addEventListener("click", function(e) {
    // reset "sets" array
    while(sets.length > 0) {
        sets.pop();
    }

    buildList();
    showSwatches(currentSet,swatchCount);
})


// Hit spacebar to like
document.addEventListener("keydown", function(e) {
    if (e.key == " ") {

        // check the value
        let val = sets[currentSet][sets[currentSet].length-1];

        if (val == true) {
            sets[currentSet][sets[currentSet].length-1] = false;
            listOfLiked.pop();
            showSwatches(currentSet,swatchCount);
        } else if (val == false) {
            sets[currentSet][sets[currentSet].length-1] = true;
            listOfLiked.push(sets[currentSet]); 
            showSwatches(currentSet,swatchCount);
        }
    }
})

function exportSVG() { 
    let exportString;
    let rectSize = 40;
    let svgY = 0;
    exportString = "";
    exportString += `<svg width="1000" height="1000">\n`;
    sets.forEach(function(set, index){
        if (set[set.length-1] == true) {
     
            for (let i = 0; i < set.length-1; i+=1) {
                exportString += `<rect x="${i*rectSize}" y="${svgY*rectSize}" `;
                exportString += `width="${rectSize}" height="${rectSize}" `;
                exportString +=`fill="${set[i]}" />\n`;
            }
            svgY += 1;
        }
    });
    exportString += `</svg>`;

    // This takes the svg code string, prepares it, and downloads it (firefox)
    let svgData = exportString;
    let svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "colors.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

let btnDownload = document.querySelector("#download");
btnDownload.addEventListener("click", function() {
    exportSVG();
});

