// Don't know what this does
window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;

// Setup websocket connection
var connection = new WebSocket('ws://localhost:5051/games/csgo/gsi/sources/032ea9b5-867f-462f-98a7-5c415272ceee/play');

connection.onopen = function(){
  /*Send a small message to the console once the connection is established */
  console.log('Connection open!');
}


// simpleheat boilerplate
function get(id) {
    return document.getElementById(id);
}
var null_data = [];


// create the heatmap
var heat = simpleheat('canvas').data(null_data).max(18),
    frame;

function draw() {
    console.time('draw');
    heat.draw();
    console.timeEnd('draw');
    frame = null;
}

// end simpleheat boilerplate

// Add line in the heatmap
var x_count = 0;
var y_count = 0
while (x_count < 200){
  heat.add([x_count, y_count, 1]);
  x_count +=1 ;
  y_count +=1 ;
}


// respond to websocket messages
connection.onmessage = function(msg){
  console.log("message recieved, captian");
  payload = JSON.parse(msg.data);
  if ("allplayers" in payload){
    // get positional data points, draw
    player_1_id = Object.keys(payload.allplayers)[0];
    console.log("player id: " + player_1_id);
    // get position of player 1
    position = payload.allplayers[player_1_id].position.split(",").map(parseFloat);
    console.log(position);
    x = Math.abs(position[0]);
    y = Math.abs(position[1]);
    heat.add([50, y, 1]);
    frame = frame || window.requestAnimationFrame(draw);


  }
}

// Draw heatmap
draw();

// simpleheat stuff, needs to be after draw() (??)
var radius = get('radius'),
    blur = get('blur'),
    changeType = 'oninput' in radius ? 'oninput' : 'onchange';

radius[changeType] = blur[changeType] = function (e) {
    heat.radius(+radius.value, +blur.value);
    frame = frame || window.requestAnimationFrame(draw);
};

