

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var weapons = require('./public/weapons.js')

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')))

const state = {
    players: [],
    boss: {},
    bullets: []
}
  
const WORLD_WIDTH = 1000
const WORLD_HEIGHT = 800
const numPlayers = 0

function reset() {
    //const { players, enemies, coins } = state
        var _state = state,
      players = _state.players,
      boss = _state.boss,
      bullets = _state.bullets;
    // const players = state.players
  
    // init players
    players.forEach((player,i) => {
        player.x = i%2 == 0? 20 : WORLD_WIDTH-20
        player.y = i < 3? 20 : WORLD_HEIGHT-20
        player.vel = 5
        player.radius = 20
        player.weaponsPlayer = [weapons.weapon1,weapons.weapon2]
        player.readyToShoot = true 
        player.shooting = false
        player.lastShoot = Date.now()
        player.fireRate = 500
        player.shootVel = 10
        player.damage = 5
        player.maxHp = 100
        player.hp = 100
    })
  
    // init boss
    boss.weaponsBoss = [weapons.weaponBoss1, weapons.weaponBoss2, weapons.weaponBoss3, weapons.weaponBoss4]    
    boss.weaponsBoss2 = [weapons.weaponBoss5, weapons.weaponBoss6]
    boss.x = WORLD_WIDTH/2
    boss.y = WORLD_HEIGHT/2
    //boss.velX = 2
    //boss.velY = 1
    boss.weaponsBoss = [weapons.weaponBoss1, weapons.weaponBoss2, weapons.weaponBoss3, weapons.weaponBoss4]
    boss.weaponsBoss2 = [weapons.weaponBoss5, weapons.weaponBoss6]
    boss.fireRate = 200
    boss.shootVel = 10
    boss.lastShoot = Date.now()
    boss.angle = Date.now() / 2000 % (Math.PI*2)
    boss.radius = 185
    boss.maxHp = 10000
    boss.hp = 10000
    
    while (bullets.length) bullets.pop()
}

reset()

function IntersectCirlce(c1, c2) {
    return ( Math.sqrt(Math.pow((c1.x-c2.x),2) +  Math.pow((c1.y-c2.y),2)) < (c1.radius+c2.radius) )
}



function logic () {
    setTimeout(logic, 16)
    if(boss.hp <= 0)
        setTimeout(reset, 5000)
    //const { players, enemies, coins } = state

    var players = state.players
    var boss = state.boss
    var bullets = state.bullets
    
    // player logic
    players.forEach(player => {
        if (player.hp < 0) return

        var keyboard = player.keyboard;
        var mouse = player.mouse;
  
        var oldX = player.x
        var oldY = player.y
        var intersectX = false
        var intersectY = false
        
        if (keyboard.a && player.x > 10) {
            player.x -= player.vel
            if(boss.hp > 0 && IntersectCirlce(player,boss))
                intersectX = true
                
        }

        if (keyboard.d && player.x < WORLD_WIDTH-10) {
            player.x += player.vel
            if(boss.hp > 0 && IntersectCirlce(player,boss))
                intersectX = true
        }

        if (keyboard.w && player.y > 10) {
            player.y -= player.vel
            if(boss.hp > 0 && IntersectCirlce(player,boss))
                intersectY = true
        }
        
        if (keyboard.s && player.y < WORLD_HEIGHT-10) {
            player.y += player.vel
            if(boss.hp > 0 && IntersectCirlce(player,boss))
                intersectY = true
        }

        if(intersectX) {
            player.x = oldX
            player.y += (player.y > WORLD_HEIGHT/2? 1 : -1)
        }
        if(intersectY) {
            player.y = oldY
            player.x += (player.x > WORLD_WIDTH/2? 1 : -1)
        }

        player.angleToMouse = Math.atan2(mouse.y - player.y,mouse.x - player.x)

        if(player.hp > 0 && mouse.click && (Date.now() >= (player.lastShoot+player.fireRate))) {
            player.lastShoot = Date.now()
            console.log("hello")
            player.weaponsPlayer.forEach(weapon => { 
                bullets.push({
                    id: player.id,
                    x: Math.cos(weapon.angle+player.angleToMouse+Math.PI/2)*weapon.magnitude + player.x,
                    y: Math.sin(weapon.angle+player.angleToMouse+Math.PI/2)*weapon.magnitude + player.y,
                    velX: Math.cos(player.angleToMouse)*player.shootVel,
                    velY: Math.sin(player.angleToMouse)*player.shootVel,
                    radius: weapon.bulletRadius,
                    damage: player.damage
                })
            })
            
        }
    })
  
    // enemy logic
    boss.angle = Date.now() / 2000 % (Math.PI*2)
    if(boss.hp > 0 && (Date.now() >= (boss.lastShoot+boss.fireRate))) {
        boss.lastShoot = Date.now()
        boss.weaponsBoss.forEach((weaponBoss,i) => {
            bullets.push({
                id: boss.id, //
                x: Math.cos(weaponBoss.angle+boss.angle)*weaponBoss.magnitude + boss.x,
                y: Math.sin(weaponBoss.angle+boss.angle)*weaponBoss.magnitude + boss.y,
                velX: Math.cos(weaponBoss.angle+boss.angle)*boss.shootVel,
                velY: Math.sin(weaponBoss.angle+boss.angle)*boss.shootVel,
                radius: weaponBoss.bulletRadius,
                damage: 2
            })
        })
        boss.weaponsBoss2.forEach((weaponBoss,i) => {
            bullets.push({
                id: boss.id,
                x: Math.cos(weaponBoss.angle-boss.angle)*weaponBoss.magnitude + boss.x,
                y: Math.sin(weaponBoss.angle-boss.angle)*weaponBoss.magnitude + boss.y,
                velX: Math.cos(weaponBoss.angle-boss.angle)*boss.shootVel,
                velY: Math.sin(weaponBoss.angle-boss.angle)*boss.shootVel,
                radius: weaponBoss.bulletRadius,
                damage: 2
            })
        })
    }

    for (i = bullets.length-1; i >= 0; --i) {

        bullets[i].x += bullets[i].velX
        bullets[i].y += bullets[i].velY
        
        var deleteBullet = false
        if(bullets[i].x > WORLD_WIDTH+20 || bullets[i].x < -20) 
            deleteBullet = true
        if(bullets[i].y > WORLD_HEIGHT+20 || bullets[i].y < -20)  
            deleteBullet = true
        
        players.forEach(player => {
            if(bullets[i].id != player.id) {
                if(player.hp > 0 && IntersectCirlce(bullets[i], player)) {
                        deleteBullet = true
                        player.hp -= bullets[i].damage
                } 
            }
            else {
                if(IntersectCirlce(bullets[i], boss)) {
                    deleteBullet = true
                    boss.hp -= bullets[i].damage
                } 
            }
        })      
        if(deleteBullet)  
            bullets.splice(i,1)
    }
    io.sockets.emit('state', state)
  }
  logic()

io.on('connection', (socket) => {
    console.log('player connected')
  
    const player = {
      x: state.players.length%2 == 0? 20 : WORLD_WIDTH-20,
      y: state.players.length < 2? 20 : WORLD_HEIGHT-20,
      vel: 5,
      radius: 20,
      weaponsPlayer: [weapons.weapon1,weapons.weapon2],
      readyToShoot: true,
      shooting: false,
      lastShoot: Date.now(),
      fireRate: 500,
      shootVel: 10,
      damage: 5,
      maxHp: 100,
      hp: 100,
      id: socket.id,
      keyboard: {},
      mouse: {}
    }
  
    state.players.push(player)
  
    socket.on('inputKey', function (keyboard) {
      console.log('got player input', keyboard)
      player.keyboard = keyboard
    })

    socket.on('inputMouse', function (mouse) {
        console.log('got player input', mouse)
        player.mouse = mouse
    })
  
    function findPlayer(player) {
        return player.id === socket.id
    }
  
    socket.on('disconnect', function(){
        state.players.splice(state.players.find(findPlayer), 1)
    })
  
  })