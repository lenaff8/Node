        // BOSS RENDER
function renderBoss1() { 

    // layer 1
    ctx.save()
    ctx.translate(boss.x, boss.y)
    boss.angle = Date.now() / 2000 % (Math.PI*2)+Math.PI/2
    ctx.rotate(boss.angle)
    
    ctx.fillStyle = 'gray'
    boss.weaponsBoss.forEach((weaponBoss,i) => {
        ctx.beginPath()
        ctx.fillRect(weaponBoss.x,weaponBoss.y, weaponBoss.width, weaponBoss.height)
    
    })
    ctx.fillStyle = '#121212'
    ctx.beginPath() 
    ctx.arc(0,0,180,0,2*Math.PI);
    ctx.fill()
    
    ctx.restore()

    // layer 2
    ctx.save()
    ctx.translate(boss.x, boss.y)
    boss.angle = Date.now() / 2000 % (Math.PI*2)+Math.PI/2
    ctx.rotate(-boss.angle)

    ctx.fillStyle = 'gray'
    boss.weaponsBoss2.forEach((weaponBoss,i) => {
        ctx.beginPath()
        ctx.fillRect(weaponBoss.x,weaponBoss.y, weaponBoss.width, weaponBoss.height)
    
    })
    ctx.fillStyle = '#232323'
    ctx.beginPath() 
    ctx.arc(0,0,80,0,2*Math.PI);
    ctx.fill()

    ctx.restore()
}