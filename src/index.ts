class Vec2D {
	x: number
	y: number

	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
}

class Entity {
	position: Vec2D
	velocity: Vec2D
	mass: number
	radius: number
	restitution: number

	constructor(x: number = 0, y:number = 0) {
		this.position = new Vec2D(x, y)
		this.velocity = new Vec2D(0, 0)
		this.mass = 0.1
		this.radius = 15
		this.restitution = -0.7
	}
}

class Wall {
	position: Vec2D
	from: number
	to: number
	type: string
	friction: number

	constructor(x: number = 0, y: number = 0, type = "ground") {
		this.position = new Vec2D(x, y)
		this.from = -1000
		this.to = 1000
		this.type = type
		this.friction = 1.01
	}

	relative() {
		if (this.type === "ground") {
			let x1 = this.position.x + this.from
			let x2 = this.position.y + this.to
			return {from: x1, to: x2}
		} else {
			return {from: this.from, to: this.to}
		}
	}
}

function main() {
	// Constants
	const FRAMERATE  = 1 / 60
	const FRAMEDELAY = FRAMERATE * 1000

	const Cd = 0.47
	const rho = 1.22

	// TODO: Make A part of loop.
	const radius = 15
	const A = Math.PI * radius * radius / (10000) // m^2

	const ag = 9.81

	// Setup
	const canvas = <HTMLCanvasElement>document.getElementById("canvas")
	var ctx = canvas.getContext("2d")

	var entities: Entity[] = []
	var walls: Wall[] = []
	entities.push(new Entity(canvas.width / 2, 0))
	walls.push(new Wall(canvas.height, canvas.width / 2))

	ctx.fillStyle = 'red'
	ctx.strokeStyle = 'black'
	// setInterval(loop, FRAMEDELAY)
	window.addEventListener('keydown', handleInput,false);
	loop()

	function loop() {
		for (let entity of entities) {
			gravityCalc(entity)
			scanCollisions(entity)
			ctx.clearRect(0,0,canvas.width,canvas.height)
			drawEntity(entity)
			setInterval(() => {}, FRAMEDELAY)
			drawWalls()
		}
		requestAnimationFrame(loop)
	}

	function gravityCalc(entity: Entity) {
		let Fx = -0.5 * Cd * A * rho * entity.velocity.x * entity.velocity.x * entity.velocity.x / Math.abs(entity.velocity.x)
		let Fy = -0.5 * Cd * A * rho * entity.velocity.y * entity.velocity.y * entity.velocity.y / Math.abs(entity.velocity.y)
		
		if (isNaN(Fx)) {
			Fx = 0 
		}

		if (isNaN(Fy)){
			Fy = 0
		}

		let ax = Fx / entity.mass
		let ay = ag + (Fy / entity.mass)

		entity.velocity.x += ax * FRAMERATE
		entity.velocity.y += ay * FRAMERATE

		entity.position.x += entity.velocity.x * FRAMERATE * 100 
		entity.position.y += entity.velocity.y * FRAMERATE * 100
		return entity
	}

	function scanCollisions(entity: Entity) {
		for (let wall of walls) {
			switch (wall.type) {
				case "ground":{
					if ((entity.position.y + entity.radius) > wall.position.y) {
						if (wall.relative().from < entity.position.x && entity.position.x  < wall.relative().to) {
							entity.velocity.y *= entity.restitution
							// entity.velocity.x -= entity.velocity.x / wall.friction
							// Temporary bad friction
							// TODO: Redo friction.
							entity.velocity.x /= wall.friction
							entity.position.y = (wall.position.y - entity.radius)
						}
					}
					break
				}
				default:{
					break
				}
			}
		}
	}

	function drawEntity(entity: Entity) {
		ctx.beginPath()
		ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, Math.PI * 2, true)
		ctx.fill()
		ctx.closePath()
	}

	function drawWalls() {
		for (let wall of walls) {
			ctx.beginPath()
			ctx.moveTo(wall.relative().from, wall.position.y)
			ctx.lineTo(wall.relative().to, wall.position.y)
			ctx.stroke()
		}
	}

	function handleInput(event) {
		switch (event.keyCode) {
			// Left
			case 37: {
				entities[0].velocity.x -= 5
				break
			}
			// Up
		 	case 38: {
		 		entities[0].velocity.y -= 5
		 		break
		 	}
		 	// Right
		 	case 39: {
		 		entities[0].velocity.x += 5
		 		break
		 	}
		 	// Down
		 	case 40: {
		 		entities[0].velocity.y += 5
		 		break
		 	}
		 	default:
		 		break
		 }

	}
}

main()