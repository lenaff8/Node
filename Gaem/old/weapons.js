// Weapons Player

const weapon1 = {
    x: -23, y: -16, 
    width: 5, height: 12,
    angle: (Math.atan2(-16,-23)),
    magnitude: Math.sqrt(Math.pow(23,2)+ Math.pow(16,2)),
    bulletRadius: 4
}
const weapon2 = {
    x: 18, y: -16, 
    width: 5, height: 12,
    angle: (Math.atan2(-16,18)),
    magnitude: Math.sqrt(Math.pow(18,2)+ Math.pow(16,2)),
    bulletRadius: 4
}


// Weapons Boss

const weaponBoss1 = {
    x: -20, y: -210, 
    width: 40, height: 60,
    angle: (Math.atan2(-210,0)),
    magnitude: 215,
    bulletRadius: 8
}

const weaponBoss2 = {
    x: -20, y: 150, 
    width: 40, height: 60,
    angle: (Math.atan2(150,0)),
    magnitude: 215,
    bulletRadius: 8
}

const weaponBoss3 = {
    x: -210, y: -20, 
    width: 60, height: 40,
    angle: (Math.atan2(0,-210)),
    magnitude: 215,
    bulletRadius: 8
}

const weaponBoss4 = {
    x: 150, y: -20, 
    width: 60, height: 40,
    angle: (Math.atan2(0,150)),
    magnitude: 215,
    bulletRadius: 8
}

const weaponBoss5 = {
    x: -20, y: -110, 
    width: 40, height: 40,
    angle: (Math.atan2(-110,0)),
    magnitude: 115,
    bulletRadius: 8
}

const weaponBoss6 = {
    x: -20, y: 70, 
    width: 40, height: 40,
    angle: (Math.atan2(70,0)),
    magnitude: 115,
    bulletRadius: 8
}