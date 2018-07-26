// PVector2D with a nicer name.
class Vec2D {
	x: number
	y: number

	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	draw (ctx: CanvasRenderingContext2D, size = 2) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, size, 0, Math.PI * 2, true);
		ctx.fill()
	}
}

class Shape2D {
	pos: Vec2D

	constructor () {
		this.pos = new Vec2D(0, 0)
	}
}

class Box2D extends Shape2D {
	from: Vec2D
	to: Vec2D

	constructor (from: Vec2D, to: Vec2D) {
		super()
		this.from = from
		this.to = to
	}

	contains (point: Vec2D): boolean {
		let from = this.from
		let to = this.to

		from.x += this.pos.x
		from.y += this.pos.y

		to.x += this.pos.x
		to.y += this.pos.y 

		if (from.x < point.x && point.x < to.x && from.y < point.y && point.y < to.y) {
			return true	
		} else {
			return false
		}
	}

	draw (ctx) {
		ctx.beginPath()
		ctx.rect(this.pos.x, this.pos.y, this.to.x - this.from.x, this.to.y - this.from.x)
		ctx.stroke()
	}
}

class Polygon2D extends Shape2D {
	points: Vec2D[]
	constructor (points = []) {
		super()
		this.points = points
	}

	boundingBox(): Box2D {
		const min = new Vec2D
		const max = new Vec2D

		for (const point of this.points) {
			if (point.x < min.x) {
				min.x = point.x
			} else if (point.x > max.x) {
				max.x = point.x
			}

			if (point.y < min.y) {
				min.y = point.y
			} else if (point.y > max.y) {
				max.y = point.y
			}
		}
		min.x += this.pos.x
		max.x += this.pos.x

		min.y += this.pos.y
		max.y += this.pos.y

		const box = new Box2D(min, max)
		return box
	}

	contains(point: Vec2D): boolean {
		if (this.boundingBox().contains(point)) {
			let inside = false
			for (let i = 0, n = this.points.length - 1; i < this.points.length; n = i++) {
				let vec = this.points[i]
				let vecNext = this.points[n]

				vec.x += this.pos.x
				vec.y += this.pos.y
				vecNext.x += this.pos.x
				vecNext.y += this.pos.y

        if(((vec.y > point.y) != (vecNext.y > point.y)) && (point.x < (vecNext.x - vec.x) * (point.y - vec.y) / (vecNext.y - vec.y) + vec.x) ) inside = !inside;
			}
			return inside
		} else {
			return false
		}
	}

	draw(ctx) {
		ctx.beginPath()
		for (let point of this.points) {
			ctx.lineTo(point.x + this.pos.x, point.y + this.pos.y)
		}
		ctx.lineTo(this.points[0].x + this.pos.x, this.points[0].y + this.pos.y)
		ctx.stroke()
	}

}

class Entity {
	pos: Vec2D
	weight: number
	velocity: Vec2D

	constructor(x = 0, y = 0) {
		this.pos = new Vec2D(x, y)
		this.weight = 10
		this.velocity = new Vec2D(0, 0)
	}

	applyGravity(amount: number) {
		this.velocity.y += this.weight * amount
	}

	applyForces() {
		this.pos.x += this.velocity.x
		this.pos.y += this.velocity.y

		this.velocity = new Vec2D(0, 0)
	}

	draw (ctx: CanvasRenderingContext2D) {
		this.pos.draw(ctx)
	}
}


 var background = <HTMLCanvasElement>document.getElementById("background")
 var foreground = <HTMLCanvasElement>document.getElementById("foreground")
 var btx = background.getContext("2d")
 var ftx = foreground.getContext("2d")

let stage: Vec2D[] = []
stage[0] = new Vec2D(0,0)
stage[1] = new Vec2D(200,30)
stage[2] = new Vec2D(150,200)
stage[3] = new Vec2D(50,200)

btx.strokeStyle = "white"
var shape = new Polygon2D(stage)
shape.pos.x = 200
shape.pos.y = 200
shape.draw(btx)

btx.fillStyle = "red"
var point = new Vec2D(250, 255)
point.draw(btx)

var ball = new Entity(250, 50)
ball.draw(ftx)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animate() {
	ftx.clearRect(0, 0, foreground.width, foreground.height)
	ball.applyGravity(1)
	ball.applyForces()

	console.log(shape.contains(ball.pos))
	console.log(ball.pos)

	if (shape.contains(ball.pos) == true) {
		ftx.fillStyle = "blue"
		ftx.strokeStyle = "blue"
	} else {
		ftx.fillStyle = "red"
		ftx.strokeStyle = "red"
	}

	ball.draw(ftx)
	await sleep((1 / 60) * 10000)
	window.requestAnimationFrame(animate)
}

animate()