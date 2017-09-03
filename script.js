function $(id) { return document.getElementById(id); }
$("litw").style.backgroundColor = "black";

var cW = document.documentElement.clientWidth, cH = document.documentElement.clientHeight;
var ctx = null;
var tileW = cH/10, tileH = cH/10;
var mapW = 10, mapH = 10;
var currentSecond = 0, frameCount = 0, frameLastSecond = 0;
var lastFrameTime = 0;
/*if(cW > cH)
{*/
    $("litw").setAttribute('width', cW);
    $("litw").setAttribute('height', cH);
    tileW = cH/10, tileH = cH/10;
/*	} else {
    $("litw").setAttribute('width', cW);
    $("litw").setAttribute('height', cH);
        tileW = cW/10, tileH = cW/10;
}*/

var keysDown = {
    37: false,
    38: false,
    39: false,
    40: false
}


var player = new Character();

var gameMap = [
    0,0,0,0,0,0,0,0,0,0,
    0,1,1,1,0,1,0,1,1,0,
    0,1,1,1,1,1,1,1,1,0,
    0,1,1,1,1,1,1,1,1,0,
    1,0,0,1,0,1,0,1,0,0,
    0,1,1,1,0,1,0,1,1,0,
    0,1,1,1,1,1,1,1,1,0,
    0,1,1,1,0,1,0,1,1,0,
    0,1,1,1,1,1,1,1,1,0,
    0,0,0,0,0,0,0,0,0,2,
];

function Character()
{
    this.tileFrom = [1,1];
    this.tileTo = [1,1];
    this.timeMoved = 0;
    this.dimensions = [tileW,tileH];
    this.position = [tileW,tileH];
    this.delayMove = 400;
}

Character.prototype.placeAt = function (x,y) {
    this.tileFrom = [x,y];
    this.tileTo = [x,y];
    this.position = [((tileW*x)+((tileW-this.dimensions[0])/2)),
        ((tileW*y)+((tileW-this.dimensions[1])/2))];
};

Character.prototype.processMovement = function (t)
{
    if(this.tileFrom[0]==this.tileTo[0]&&this.tileFrom[1]==this.tileTo[1])
    {
        return false;
    }
    if((t-this.timeMoved)>=this.delayMove)
    {
        this.placeAt(this.tileTo[0],this.tileTo[1]);
    }
    else {
        this.position[0]=(this.tileFrom[0]*tileW)+((tileW-this.dimensions[0])/2);
        this.position[1]=(this.tileFrom[1]*tileH)+((tileW-this.dimensions[1])/2);
        if(this.tileTo[0]!=this.tileFrom[0])
        {
            var diff = (tileW / this.delayMove) * (t-this.timeMoved);
            this.position[0]+=(this.tileTo[0]<this.tileFrom[0]?0-diff:diff);
        }
        if(this.tileTo[1]!=this.tileFrom[1])
        {
            var diff = (tileH / this.delayMove) * (t-this.timeMoved);
            this.position[1]+=(this.tileTo[1]<this.tileFrom[1]?0-diff:diff);
        }
        this.position[0] = Math.round(this.position[0]);
        this.position[1] = Math.round(this.position[1]);

    }

    return true;
};

function toIndex(x, y)
{
    return ((y*mapW)+x);
}

window.onload = function()
{
    ctx = $("litw").getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";

    window.addEventListener("keydown", function(e){
        var keyC = e.keyCode;
        if(keyC>=37&&keyC<=40)
        {
            keysDown[keyC] = true;
        }
    });
    window.addEventListener("keyup", function(e){
        var keyC = e.keyCode;
        if(keyC>=37&&keyC<=40)
        {
            keysDown[keyC] = false;
        }
    });
};

function drawGame()
{
    if (ctx == null)
    {
        return;
    }
    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;
    var sec = Math.floor(Date.now()/1000);
    if(sec!=currentSecond)
    {
        currentSecond = sec;
        frameLastSecond = frameCount;
        frameCount = 1;
    } else
    {
        frameCount ++;
    }

    if(!player.processMovement(currentFrameTime))
    {
        if(keysDown[37] && player.tileFrom[0]>0&& gameMap[toIndex(player.tileFrom[0]-1,player.tileFrom[1])]==1)
        {
            player.tileTo[0]-=1;
        } else
        if(keysDown[38] && player.tileFrom[1]>0&& gameMap[toIndex(player.tileFrom[0],player.tileFrom[1]-1)]==1)
        {
            player.tileTo[1]-=1;
        } else
        if(keysDown[39] && player.tileFrom[0]<(mapW-1)&& gameMap[toIndex(player.tileFrom[0]+1,player.tileFrom[1])]==1)
        {
            player.tileTo[0]+=1;
        } else
        if(keysDown[40] && player.tileFrom[1]<(mapH-1)&& gameMap[toIndex(player.tileFrom[0],player.tileFrom[1]+1)]==1)
        {
            player.tileTo[1]+=1;
        }
        if(player.tileFrom[0]!=player.tileTo[0] || player.tileFrom[1]!=player.tileTo[1])
        {
            player.timeMoved = currentFrameTime;
        }
    }

    for(var y = 0; y < mapH; y++)
    {
        for(var x = 0; x < mapW; x++)
        {
            switch (gameMap[((y*mapW)+x)]) {
                case 0:
                    ctx.fillStyle = "#3A0";
                    break;
                case 1:
                    ctx.fillStyle = "#650";
                    break;
                default:
            }
            ctx.fillRect(x*tileW, y*tileH, tileW, tileH)
        }
    }
ctx.fillStyle = "#0000ff";
//ctx.fillRect(player.position[0], player.position[1],player.dimensions[0],player.dimensions[1]);

function drawPlayer(direction)
{
    var colorCode = ["#000","#431","#49B"]
    var hairPart = [[0,0,0,0,0,1,1,1],
                    [0,0,0,0,1,1,1,1],
                    [0,0,0,1,1,1,1,1],
                    [0,0,0,1,1,1,1,1],
                    [0,0,0,1,1,1,1,1],
                    [0,0,0,1,1,1,1,1],
                    [0,0,0,0,1,1,1,1],
                    [0,0,0,2,2,1,1,1]]
    //var facePart = [{},{},{},{},{},{},{},{}]
    if(direction =="S")
    {
        for(var y=0; y<hairPart.length;y++)
        {
            for(var x=0; x<hairPart[y].length;x++)
            {
                    ctx.fillStyle = colorCode[hairPart[y][x]];
                    ctx.fillRect(Math.floor(player.position[0]+x*(tileH/16)), Math.round(player.position[1]+y*(tileH/16)),tileH/16,tileW/16);
            }
        }
    }
    if(direction =="L")
    {

    }
    //console.log(hairPart.length);
    if(direction =="R") {
        for(var y=0; y<hairPart.length;y++)
        {
            for(var x=0; x<hairPart[y].length;x++)
            {
                    ctx.fillStyle = colorCode[hairPart[y][x]];
                    ctx.fillRect(player.position[0]+x*(tileH/16), player.position[1]+y*(tileH/16),tileH/16,tileW/16);
            }
        }

    }
}


    if(keysDown[37])
    {
        drawPlayer("L");
    } else
    if(keysDown[38])
    {

    } else
    if(keysDown[39])
    {
        drawPlayer("R");
    } else
    if(keysDown[40])
    {

    }
    if(!(keysDown[37]&&keysDown[38]&&keysDown[39]&&keysDown[40]))
    {
        drawPlayer("S");
    }



ctx.fillStyle = "#ff0000";
ctx.fillText("FPS: "+frameLastSecond, 10,20);
lastFrameTime = currentFrameTime;
requestAnimationFrame(drawGame);
}
