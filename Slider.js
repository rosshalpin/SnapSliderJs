class Slider {

  constructor(width, max) {
    this.width = width;
    this.max = max;
    if (max % 2 !== 0) {
      throw "max value must be even";
    }
  }

  component = () => {
    var style = document.createElement("style");
    document.head.appendChild(style);
    var width = this.width;
    var max = this.max;
    var min = 0;
    var val = max / 2;

    var rule0 =
      `#gradient {
       
        position: absolute;
        border-radius: 10px;
        border: 2px solid rgb(255, 255, 255);
        box-shadow: 0px 0px 2px 0px black;
      }`
    var rule1 =
      `.slider {
        -webkit-appearance: none;
        height: 10px;
        background: transparent;
        outline: none;
        position: absolute;
        width: ${width}px;
       
      }`
    var rule2 =
      `.slider::-webkit-slider-thumb {
        position: relative;
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        border: 4px solid rgb(255, 255, 255);
        box-shadow: 0px 0px 3px 0px black;
      }`
    var rule3 =
      `.slider:active {
        
        animation: move 0.5s forwards;
        
      }`
    var rule4 =
      `.slider:active::-webkit-slider-thumb {
        width: 20px;
        cursor: pointer;
        height: 20px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(135deg);
        border: 4px solid rgb(255, 255, 255);
        box-shadow: 0px 0px 3px 0px black;
         
        
        
      }`

    var rule5 =
      `@keyframes move {

      100% {
        transform: translateY(45px);
        width: ${width+40}px;
        margin-left: -20px;
      }
    }`

    style.sheet.insertRule(rule0, 0);
    style.sheet.insertRule(rule1, 1);
    style.sheet.insertRule(rule2, 2);
    style.sheet.insertRule(rule3, 3);
    style.sheet.insertRule(rule4, 4);
    style.sheet.insertRule(rule5, 5);

    var rules = style.sheet.cssRules;

    var canvas = document.createElement("CANVAS");
    canvas.width = width;
    canvas.height = 10;
    canvas.id = "gradient";

    var slider = document.createElement("INPUT");
    slider.width = canvas.width;
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.value = val;
    slider.className = "slider";
    slider.id = "colorRange";

    var pixelData = (function getClr() { // creating canvas gradient and returning image data
      let ctx = canvas.getContext("2d");
      let grd = ctx.createLinearGradient(0, 0, width, 10);

      grd.addColorStop(0, "white");
      grd.addColorStop(1 / 10, "red");
      grd.addColorStop(2 / 10, "purple");
      grd.addColorStop(3 / 10, "blue");
      grd.addColorStop(4 / 10, "aqua");
      grd.addColorStop(5 / 10, "aqua");
      grd.addColorStop(6 / 10, "lime");
      grd.addColorStop(7 / 10, "yellow");
      grd.addColorStop(8 / 10, "yellow");
      grd.addColorStop(9 / 10, "red");
      grd.addColorStop(10 / 10, "black");

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, 10);

      return ctx.getImageData(0, 0, width, 1).data;
    })();

    var color = { // setting initial rgb values
      r: pixelData[(val * (width / max) * 4)],
      g: pixelData[(val * (width / max) * 4) + 1],
      b: pixelData[(val * (width / max) * 4) + 2]
    };

    rules[2].style.background = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'; //applying initial rgb values to slider thumb
    
    
    /* CUSTOM ANIMATION OF NON STANDARD PSUEDO ELEMENT -webkit-slider-thumb 
        
    */
    let mouseUp = false;
    slider.onmousedown = function(){
      mouseUp = false;
      console.log();
      let startTime = new Date().getTime();
      let animLength = 1000;
      let x= 20;
      let interval = setInterval(function(){
          let now = new Date().getTime() - startTime;
          if(now > animLength || mouseUp == true){
              clearInterval(interval);
              return;
          }
          if(now < 200 && now > 100){
            x+=1;
            rules[4].style.width = x+"px";
            rules[4].style.height = x+"px";
          }
      }, 100/24);
    }
    
    slider.onmouseup = function(){
      mouseUp = true;
      rules[4].style.width = "20px";
      rules[4].style.cursor = "pointer";
      rules[4].style.height = "20px";
      rules[4].style.borderRadius = "50% 50% 50% 0";
      rules[4].style.transform = "rotate(135deg)";
      rules[4].style.border = "4px solid rgb(255, 255, 255)";
      rules[4].style.boxShadow = "0px 0px 3px 0px black";
      rules[4].style.position = "relative"; 
      rules[4].style.top = "0px";
    }
    
    slider.oninput = function() {
      /*  adjusting slider value to element length/range length ratio
          e.g with a length of 200px, and a range length of 10
          the range will then only have 10 stops every 20px.
          Each stop representing the color at that position on the gradient.
      */
      val = this.value * width / max; 

      color.r = pixelData[(val * 4)];
      color.g = pixelData[(val * 4) + 1];
      color.b = pixelData[(val * 4) + 2];

      console.log(val, color.r, color.g, color.b);

      if (val == min * width / max) {
        rules[2].style.background = 'rgb(255,255,255)'; //set to pure white if at zero
      } else if (val == max * width / max) {
        rules[2].style.background = 'rgb(0,0,0)'; //set to pure black if at max
      } else {
        rules[2].style.background = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'; //set to rgb colors
      }
    }

    var container = document.createElement("DIV");
    container.appendChild(canvas);
    container.appendChild(slider);
    return container;
  }
}

var Slide = new Slider(200, 200).component();
Slide.style = "position: absolute; top: 200px; left: 200px;";
document.body.appendChild(Slide);
