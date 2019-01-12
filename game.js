//functions and variables related to the player paddle
const playerPaddleOrig = 168;
let playerPaddlePos = playerPaddleOrig;
let playerPaddleVel = 0;

const leftArrow = 37;
const rightArrow = 39;
const playerPaddleSpeed = 3;
function keyDown()
{
    if(isGameReset)
    {
        ballVel.x = 0;
        ballVel.y = -ballVerticalSpeed;
        isGameReset = false;
    }
    let key = window.event.keyCode;
    if(key == leftArrow)
    {
        playerPaddleVel = -playerPaddleSpeed;
    }
    if(key == rightArrow)
    {
        playerPaddleVel = playerPaddleSpeed;
    }
}

function keyUp()
{
    playerPaddleVel = 0;
}

function translatePlayerPaddle(x)
{
    const newPos = playerPaddlePos + x;
    if(newPos <= (400 - 80) && newPos >= 0)
    {
        playerPaddlePos = newPos;
    }
    document.getElementById("playerPaddle").style.transform = "translate(" + (playerPaddlePos - playerPaddleOrig) + "px,0px)";
}

//functions and variables related to the ball
const ballOrig = {x:195,y:166};
let ballPos = {x:ballOrig.x,y:ballOrig.y};
let ballVel = {x:0,y:0};
function runBallLogic()
{
    const collisionObject = getObjectsCollidedWithBall();
    const scoreStatus = isBallScored();
    if(collisionObject != NONE)
    {
        handleBallCollision(collisionObject);
    }
    else if(scoreStatus != NO_GOAL)
    {
        handleBallBeingScored(scoreStatus);
    }
    else
    {
        translateBall(ballVel.x,ballVel.y);
    }
}

function translateBall(x,y)
{
    ballPos.x += x;
    ballPos.y += y;
    document.getElementById("ball").style.transform = "translate(" + (ballPos.x - ballOrig.x) + "px," + (ballPos.y - ballOrig.y) + "px)";
}

function resetBall()
{
    document.getElementById("ball").style.left = ballOrig.x + "px";
    document.getElementById("ball").style.top = ballOrig.y + "px";
    ballPos.x = ballOrig.x;
    ballPos.y = ballOrig.y;
}

//Collision Object IDs
const NONE = -1;
const PLAYER_PADDLE = 0;
const LEFT_WALL = 1;
const RIGHT_WALL = 2;
const OPP_PADDLE = 3;

const ballWidth = 10;
const playerPaddleLat = 325;
const paddleWidth = 65;
const paddleHeight = 10;
const oppPaddleLat = 8;
function getObjectsCollidedWithBall()
{
    if(ballPos.y >= (playerPaddleLat - ballWidth) && ballPos.x >= playerPaddlePos && (ballPos.x + ballWidth) <= (playerPaddlePos + paddleWidth))
    {
        return PLAYER_PADDLE;
    }
    if(ballPos.y <= (oppPaddleLat + paddleHeight) && ballPos.x >= oppPaddlePos && (ballPos.x + ballWidth) <= (oppPaddlePos + paddleWidth))
    {
        return OPP_PADDLE;
    }
    if(ballPos.x <= 0)
    {
        return LEFT_WALL;
    }
    if(ballPos.x + ballWidth >= 385)
    {
        return RIGHT_WALL;
    }
    return NONE;
}

let successfulHits = 0;
function handleBallCollision(collisionObject)
{
    if(collisionObject == PLAYER_PADDLE)
    {
        successfulHits++;
        ballVel.y = -ballVerticalSpeed;
        translateBall(0,ballVel.y);
        const distanceFromCentre = Math.abs((ballPos.x + (ballWidth / 2)) - (playerPaddlePos + (paddleWidth / 2)));
        let directionX = Math.abs(ballVel.x)/ballVel.x
        if(ballVel.x == 0)
        {
            directionX = 1;
        }
        ballVel.x = (distanceFromCentre / 32 * 2) * directionX;
    }
    else if(collisionObject == OPP_PADDLE)
    {
        ballVel.y = ballVerticalSpeed;
        translateBall(0,ballVel.y);
    }
    else if(collisionObject == LEFT_WALL || collisionObject == RIGHT_WALL)
    {
        ballVel.x *= -1;
        translateBall(ballVel.x,0);
    }
}

//score status IDs
const NO_GOAL = -1;
const GOAL_FOR_OPP = 0;
const GOAL_FOR_PLAYER = 1;
function isBallScored()
{
    if(ballPos.y > 380)
    {
        return GOAL_FOR_OPP
    }
    else if(ballPos.y < 0)
    {
        return GOAL_FOR_PLAYER
    }
    return NO_GOAL;
}

function handleBallBeingScored(scoreStatus)
{
    resetGame();
    if(scoreStatus == GOAL_FOR_OPP)
    {
        alert("The computere just scored a goal!");
        updateScore(0,1);
    }
    else if(scoreStatus == GOAL_FOR_PLAYER)
    {
        alert("Congrats! You just scored a goal!");
        updateScore(1,0);
    }
}

//functions and variables for computer's paddle
const oppPaddleOrig = 168;
let oppPaddlePos = oppPaddleOrig;
let oppPaddleVel = 0;
function translateOppPaddle(x)
{
    const newPos = oppPaddlePos + x;
    if(newPos < 0)
    {
        oppPaddlePos = 0;
    }
    else if(newPos > 320)
    {
        oppPaddlePos = 320;
    }
    else
    {
        oppPaddlePos = newPos;
    }
    document.getElementById("oppPaddle").style.transform = "translate(" + (oppPaddlePos - oppPaddleOrig) + "px,0px)";
}

let oppPaddleSpeed = 3;
function runPaddleAI()
{
    if(successfulHits > 0 && successfulHits % 10 == 0 && oppPaddleSpeed != 0)
    {
        oppPaddleSpeed--;
    }
    if(ballPos.x < oppPaddlePos)
    {
        oppPaddleVel = -oppPaddleSpeed;
    }
    else if(ballPos.x + ballWidth > oppPaddlePos + paddleWidth)
    {
        oppPaddleVel = oppPaddleSpeed;
    }
    else
    {
        oppPaddleVel = 0;
    }
    translateOppPaddle(oppPaddleVel);
}

//functions and variables to run game logistics
function translateAll()
{
    translatePlayerPaddle(playerPaddleVel);
    runBallLogic();
    runPaddleAI();
}

const ballVerticalSpeed = 5;
function startGame()
{
    ballVel.x = 0;
    ballVel.y = -ballVerticalSpeed;
    window.setInterval(translateAll,20);
}

let playerScore = 0;
let compScore = 0;
function updateScore(a,b)
{
    playerScore += a;
    compScore += b;
    document.title = ("You vs. the Computer (" + playerScore + "-" + compScore + ")");
}

let isGameReset = false;
function resetGame()
{
    resetBall();
    ballVel.x = 0;
    ballVel.y = 0;
    isGameReset = true;
    oppPaddleSpeed = 3;
    successfulHits = 0;
}