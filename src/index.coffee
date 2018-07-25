class Vec2D
	constructor: ->
		@x = 0
		@y = 0

class Entity
	constructor: ->
		@position = new Vec2D(1, 0)
		@velocity = new Vec2D(0, 1)
		@mass = 0.1
		@radius = 15
		@restitution = -0.7
		@ecb = @position
	draw: (ctx, vec) ->
		ctx.beginPath()
		ctx.arc(vec.x, vec.y, @radius, Math.PI * 2, true)
		ctx.fill()
		ctx.closePath()

class Wall
	constructor: ->
		@pos = new Vec2D(0, 0)
		@from = -1000
		@pos2 = 1000
		@type = "ground"

framerate = 1 / 60
framedelay = framerate * 1000

radius = 15
Cd = 0.47  # Dimensionless
rho = 1.22 # kg / m^3
A = Math.PI * radius * radius / (10000) # m^2
ag = 9.81  # m / s^2

mainLoop = (entities, walls, ctx, canvas) ->
	for entity in entities
		Fx = -0.5 * Cd * A * rho * entity.velocity.x * entity.velocity.x * entity.velocity.x / Math.abs(entity.velocity.x)
		Fy = -0.5 * Cd * A * rho * entity.velocity.y * entity.velocity.y * entity.velocity.y / Math.abs(entity.velocity.y)
		
		Fx = 0 if isNaN(Fx)
		Fy = 0 if isNaN(Fy)

		ax = Fx / entity.mass
		ay = ag + (Fy / entity.mass)

		entity.velocity.x += ax * framerate
		entity.velocity.y += ay * framerate

		entity.position.x += entity.velocity.x * framerate * 100 
		entity.position.y += entity.velocity.y * framerate * 100
		console.log(entity.position)

		scan(walls, entity)
		draw(ctx, canvas, entities)

scan = (walls, entity) ->
	for wall in walls
		switch wall.type
			when "ground"
				if entity.ecb.y < wall.pos.y
					if (wall.pos.y - wall.from.y) < entity.ecb.y < (wall.pos.y - wall.to.y)
						entity.velocity.y *= entity.restitution
						entity.position.y = wall.pos.y
		
draw = (ctx, canvas, entities) ->
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for entity in entities
		entity.draw(ctx, entity.position)

main = ->
	entities = []
	entities.push new Entity

	walls = []
	walls.push new Wall

	canvas = document.getElementById("canvas")
	ctx = canvas.getContext("2d")

	console.log(entities)

	ctx.fillStyle = 'red'
	ctx.strokeStyle = 'black'
	loopTimer = setInterval(mainLoop(entities, walls, ctx, canvas), framedelay)

main()