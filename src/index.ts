// PVector2D with a nicer name.
class Vec2D {
	x: number
	y: number

	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	draw (ctx, size = 2) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, size, 0, Math.PI * 2, true);
		ctx.fill()
	}
}

class Shape2D {
	position: Vec2D

	constructor () {
		this.position = new Vec2D(0, 0)
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

		from.x += this.position.x
		from.y += this.position.y

		to.x += this.position.x
		to.y += this.position.y 

		if (from.x < point.x && point.x < to.x && from.y < point.y && point.y < to.y) {
			return true	
		} else {
			return false
		}
	}

	draw (ctx) {
		ctx.beginPath()
		ctx.rect(this.position.x, this.position.y, this.to.x - this.from.x, this.to.y - this.from.x)
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
		min.x += this.position.x
		max.x += this.position.x

		min.y += this.position.y
		max.y += this.position.y

		const box = new Box2D(min, max)
		return box
	}

	contains(point: Vec2D): boolean {
		if (this.boundingBox().contains(point)) {
			let inside = false
			for (let i = 0, n = this.points.length - 1; i < this.points.length; n = i++) {
				let vec = this.points[i]
				let vecNext = this.points[n]

				vec.x += this.position.x
				vec.y += this.position.y
				vecNext.x += this.position.x
				vecNext.y += this.position.y

        if(((vec.y > point.y) != (vecNext.y > point.y)) && (point.x < (vecNext.x - vec.x) * (point.y - vec.y) / (vecNext.y - vec.y) + vec.x) ) inside = !inside;
			}
			return inside
		} else {
			return false
		}
	}

	draw (ctx) {
		ctx.beginPath()
		for (let point of this.points) {
			ctx.lineTo(point.x + this.position.x, point.y + this.position.y)
		}
		ctx.lineTo(this.points[0].x + this.position.x, this.points[0].y + this.position.y)
		ctx.stroke()
	}
}


 var canvas = <HTMLCanvasElement>document.getElementById("canvas");
 var ctx = canvas.getContext("2d")

let vertices: Vec2D[] = []
vertices[0] = new Vec2D(0,0);     // set X/Y position
vertices[1] = new Vec2D(200,30);
vertices[2] = new Vec2D(150,200);
vertices[3] = new Vec2D(50,200);

let shape = new Polygon2D(vertices)
shape.position.x = 200
shape.position.y = 200
shape.draw(ctx)
let point = new Vec2D(250, 255)
ctx.fillStyle = "red"
point.draw(ctx)
ctx.fillStyle = "black"
console.log(shape.contains(point))