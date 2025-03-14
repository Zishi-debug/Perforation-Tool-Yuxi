/* MK10 Perforation tools

This is a handy tool designed for changing any patterns/images into perforatable files, which can be used in production. 
There are three different sizes of perforation holes set in this sketch, and the sizes are controlled by the brightness of the loaded image.

Make sure you have done before you start:
1. Sign up in P5.js with your Google or GitHub account.
2. Save a copy of this sketch in your account by pressing "Ctrl+S" or going to "File → Duplicate".
3. Click the Start button at the top left to run the script.

Upload your own images on the left bar by clicking the "+" button.
Press "S" on the canvas to save an SVG file.

Any questions, please contact Yuxi Chen: yuxi.chen@rolls-roycemotorcars.com
*/

//___________________________________ Parameters you can play with __________________________________________

let PixelToMilimeterRatio = 2.835; // Please check pixel-to-millimeter ratio in your Illustrator file
let img;

let dis = 2.69; // If you want a specific distance between each dot, replace the value


let size1 = 0.8 ; // Blue dots, change the dot radius
let size2 = 0.5 ; // Green dots, change the dot radius
let size3 = 0.3 ; // Red dots, change the dot radius
let size4 = 0.1 ; // Grey dots, change the dot radius

let colorRangeB = 0;   // Black threshold for brightness mapping
let colorRangeW = 90;  // White threshold for brightness mapping
let randomValue = 0; // Switch from 0 to 0+ to randomize dot positions
let circles = { size1: [], size2: [], size3: [], size4: [] };

let colorRangeBSlider, colorRangeWSlider;

function preload() {
   img = loadImage("Henry_Royce.jpg", function () {
        resizeCanvasToImage();
    }); // Input your own image
}

//___________________________________ GUI and Canvas Setup __________________________________________

function setup() {
  createCanvas(img.width, img.height, SVG);
  noLoop();
  img.loadPixels();


  setupPerforation();
}

//___________________________________ Main Perforation Logic __________________________________________

function setupPerforation() {
  circles = { size1: [], size2: [], size3: [], size4: [] }; // Clear previous circles
  size1 = size1 * PixelToMilimeterRatio; // Blue dots, change the dot radius
size2 = size2 * PixelToMilimeterRatio; // Green dots, change the dot radius
size3 = size3 * PixelToMilimeterRatio; // Red dots, change the dot radius
size4 = size4 * PixelToMilimeterRatio; // Grey dots, change the dot radius

  let cos45 = Math.cos(PI / 4);
  let sin45 = Math.sin(PI / 4);
  let centerX = width / 2;
  let centerY = height / 2;
  let res = dis * PixelToMilimeterRatio; // MK10 density, do not change
  let step = res;

  for (let y = -2*height; y < height * 2; y += step) {
    for (let x = -2*width; x < width * 2; x += step) {
      let newX = centerX + (x * cos45 - y * sin45);
      let newY = centerY + (x * sin45 + y * cos45);
      if (
        newX >= -res &&
        newX <= width + res &&
        newY >= -res &&
        newY <= height + res
      ) {
        let br = brightness(
          img.get(constrain(newX, 0, width - 1), constrain(newY, 0, height - 1))
        );

        // Use the updated color range mapping
        let r = int(map(br, colorRangeB, colorRangeW, 1, 4));
        let offsetX = random(-res * randomValue, res * randomValue);
        let offsetY = random(-res * randomValue, res * randomValue);
        let size, color;

        if (r === 1) {
          size = size1;
          color = [0, 0, 255];
          circles.size1.push({ x: newX + offsetX, y: newY + offsetY, size, color });
        } else if (r === 2) {
          size = size2;
          color = [0, 255, 0];
          circles.size2.push({ x: newX + offsetX, y: newY + offsetY, size, color });
        } else if (r === 3) {
          size = size3;
          color = [255, 0, 0];
          circles.size3.push({ x: newX + offsetX, y: newY + offsetY, size, color });
        } else if (r === 4) {
          size = size4;
          color = [155, 155, 0];
          circles.size4.push({ x: newX + offsetX, y: newY + offsetY, size, color });
        }
      }
    }
  }
  exportSVGWithLayers();
}

//___________________________________ Update Perforation When Sliders Change __________________________________________

function updatePerforation() {
    size1 = document.getElementById("size1").value;
    size2 = document.getElementById("size2").value;
    size3 = document.getElementById("size3").value;
    size4 = document.getElementById("size4").value;
    colorRangeB = document.getElementById("colorRangeB").value;
    colorRangeW = document.getElementById("colorRangeW").value;
    dis = document.getElementById("dis").value;
    randomValue = document.getElementById("randomValue").value;
  
    
    setupPerforation(); // Recalculate perforation pattern
}

//___________________________________ Export SVG __________________________________________

function exportSVGWithLayers() {
  clear();
  let svgElement = document.querySelector("svg");
  while (svgElement.firstChild) {
    svgElement.removeChild(svgElement.firstChild);
  }
  drawLayer(svgElement, circles.size1, "Layer_Size1");
  drawLayer(svgElement, circles.size2, "Layer_Size2");
  drawLayer(svgElement, circles.size3, "Layer_Size3");
  drawLayer(svgElement, circles.size4, "Layer_Size4");
}

function drawLayer(svgElement, circleArray, layerName) {
  let layerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  layerGroup.setAttribute("id", layerName);
  for (let c of circleArray) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", c.x);
    circle.setAttribute("cy", c.y);
    circle.setAttribute("r", c.size);
    circle.setAttribute("fill", `rgb(${c.color[0]},${c.color[1]},${c.color[2]})`);
    layerGroup.appendChild(circle);
  }
  svgElement.appendChild(layerGroup);
}

function loadNewImage(imageSrc) {
    img = loadImage(imageSrc, function () {
        resizeCanvasToImage();
        updatePerforation(); // Refresh with the new image
    });
}

function resizeCanvasToImage() {
    if (img) {
        resizeCanvas(img.width, img.height);
    }
}

//___________________________________ Key Press to Save SVG __________________________________________

function keyPressed() {
  if (key === "s") {
    save("Perforation_Tool.svg");
  }
}
