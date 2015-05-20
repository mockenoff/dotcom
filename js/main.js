// Set up variables
var devbox = document.querySelector('#developer'),
	devtails = document.querySelector('#developer-details'),
	writer = document.querySelector('#writer'),
	writails = document.querySelector('#writer-details'),
	header = document.querySelector('#header'),
	amper = document.querySelector('#amper'),
	closer = document.querySelector('#closer'),

	// Specifically for particles
	canvas = devbox.querySelector('#bubbles'),
	context = canvas.getContext('2d'),
	particles = [],
	last_draw = undefined,

	// Constants
	MAX_PARTICLES = 100,
	CANVAS_WIDTH = 0,
	CANVAS_HEIGHT = 0;

// Make sure the bubbles show up within the canvas
function setDimensions(e) {
	CANVAS_WIDTH = canvas.clientWidth;
	CANVAS_HEIGHT = canvas.clientHeight;
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
}
setDimensions();
window.addEventListener('resize', setDimensions);

// Populate the particles array
for (var i = 0; i < MAX_PARTICLES; i++) {
	particles.push(new Particle());
}

// Particle object
function Particle() {
	var self = this,
		pos_x = 0,
		pos_y = 0,
		vel_x = 0,
		vel_y = 0,
		acc_x = 0,
		acc_y = 1.5,
		color = 0,
		radius = 0;

	this.reset = function(){
		// Centralize position
		self.setPosX(CANVAS_WIDTH / 2);
		self.setPosY(CANVAS_HEIGHT / 2);

		// Randomize velocities
		self.setVelX(Math.random() * 40 - 20);
		self.setVelY(Math.random() * -30);

		// Also randomize the radius
		self.setRadius(Math.random() * 15);

		// And finally the color
		self.setColor(Math.random() * 360);
	};

	this.setColor = function(c){
		if (typeof(c) === 'number') {
			color = c;
		}
	};
	this.getColor = function(){
		return color;
	};

	this.setRadius = function(r){
		if (typeof(r) === 'number') {
			radius = r;
		}
	};
	this.getRadius = function(){
		return radius;
	};

	this.setPosX = function(x){
		if (typeof(x) === 'number') {
			pos_x = x;
		}
	};
	this.setPosY = function(y){
		if (typeof(y) === 'number') {
			pos_y = y;
		}
	};

	this.getPosX = function(){
		return pos_x;
	};
	this.getPosY = function(){
		return pos_y;
	};

	this.setVelX = function(x){
		if (typeof(x) === 'number') {
			vel_x = x;
		}
	};
	this.setVelY = function(y){
		if (typeof(y) === 'number') {
			vel_y = y;
		}
	};

	this.getVelX = function(){
		return vel_x;
	};
	this.getVelY = function(){
		return vel_y;
	};

	this.setAccX = function(x){
		if (typeof(x) === 'number') {
			acc_x = x;
		}
	};
	this.setAccY = function(y){
		if (typeof(y) === 'number') {
			acc_y = y;
		}
	};

	this.getAccX = function(){
		return acc_x;
	};
	this.getAccY = function(){
		return acc_y;
	};

	this.step = function(tdiff){
		// Move position
		self.setPosX(self.getPosX() + (self.getVelX() * tdiff));
		self.setPosY(self.getPosY() + (self.getVelY() * tdiff));

		// Alter velocities
		self.setVelX(self.getVelX() + (self.getAccX() * tdiff));
		self.setVelY(self.getVelY() + (self.getAccY() * tdiff));

		// Detect boundaries
		if (self.getPosX() - self.getRadius() <= 0 || self.getPosX() + self.getRadius() >= CANVAS_WIDTH) {
			self.setVelX(self.getVelX() * -1.0);
		}
		if (self.getPosY() - self.getRadius() >= CANVAS_HEIGHT) {
			self.reset();
		}
	};

	this.reset();
}

// Drawing function
function step(timestamp) {
	if (last_draw === undefined) {
		last_draw = timestamp;
	}

	// Clear the canvas
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// Draw the particles
	for (var i = 0; i < MAX_PARTICLES; i++) {
		context.beginPath();
		context.fillStyle = 'hsl(' + particles[i].getColor() + ', 80%, 70%)';
		context.arc(particles[i].getPosX(), particles[i].getPosY(), particles[i].getRadius(), Math.PI*2, false);
		context.fill();

		// Force particle movement calculations
		particles[i].step((timestamp - last_draw) / 50);
	}

	last_draw = timestamp;
	window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

// Detect hashchange
function hashCheck(e) {
	if (window.location.hash === '#writer') {
		setDisplay(1);
	} else if (window.location.hash === '#developer') {
		setDisplay(2);
	} else {
		setDisplay(0);
	}
}
hashCheck();
window.addEventListener('hashchange', hashCheck);

// Remove all position classes
function clearPosition(elem) {
	elem.classList.remove('leftest', 'lefter', 'left', 'right', 'righter', 'rightest');
	return elem;
}

// Swap display features
function setDisplay(display) {
	if (display === 1) {
		clearPosition(writails).classList.add('left');
		clearPosition(writer).classList.add('right');
		clearPosition(devbox).classList.add('righter');
		clearPosition(devtails).classList.add('rightest');
		clearPosition(header).classList.add('right');
		clearPosition(amper).classList.add('right');
		clearPosition(closer).classList.add('right');
	} else if (display === 2) {
		clearPosition(writails).classList.add('leftest');
		clearPosition(writer).classList.add('lefter');
		clearPosition(devbox).classList.add('left');
		clearPosition(devtails).classList.add('right');
		clearPosition(header).classList.add('left');
		clearPosition(amper).classList.add('left');
		clearPosition(closer).classList.add('left');
	} else {
		clearPosition(writails).classList.add('lefter');
		clearPosition(writer).classList.add('left');
		clearPosition(devbox).classList.add('right');
		clearPosition(devtails).classList.add('righter');
		clearPosition(header);
		clearPosition(amper);
		clearPosition(closer);
	}
}

function Laker(canvas, source) {
	var self = this,
		// Basic settings
		settings = {
			speed: 1,
			scale: 0.5,
			waves: 3
		},

		// Calculate usable settings
		speed = settings.speed / 4,
		scale = settings.scale / 2,
		waves = settings.waves / 1,

		// Frame stuff
		offset = 0,
		frame = 0,
		max_frames = 0,
		frames = [],
		orig_idata = undefined,

		// For the actual drawing of the waves
		context = canvas.getContext('2d'),
		image = new Image(),
		image_loaded = false,
		calculating = false,
		last_draw = undefined,

		// Track canvas size
		CANVAS_WIDTH = 0,
		CANVAS_HEIGHT = 0;

	// Allow cross origin image loading
	image.crossOrigin = 'Anonymous';

	// Add resize watcher
	function setDimensions(e) {
		CANVAS_WIDTH = canvas.clientWidth;
		CANVAS_HEIGHT = canvas.clientHeight;
		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;
	}
	setDimensions();
	window.addEventListener('resize', setDimensions);

	// Manually do what background-size: cover does
	function drawImageProp(ctx, img, dx, dy, dWidth, dHeight, offsetX, offsetY) {
		if (arguments.length === 2) {
			dx = dy = 0;
			dWidth = ctx.canvas.width;
			dHeight = ctx.canvas.height;
		}

		/// Default offset is center
		offsetX = offsetX ? offsetX : 0.5;
		offsetY = offsetY ? offsetY : 0.5;

		/// Keep bounds [0.0, 1.0]
		if (offsetX < 0) {
			offsetX = 0;
		}
		if (offsetY < 0) {
			offsetY = 0;
		}
		if (offsetX > 1) {
			offsetX = 1;
		}
		if (offsetY > 1) {
			offsetY = 1;
		}

		var iWidth = img.width,
			iHeight = img.height,
			ratio = Math.min(dWidth / iWidth, dHeight / iHeight),
			nWidth = iWidth * ratio,
			nHeight = iHeight * ratio,
			sx, sy, sWidth, sHeight,
			aspect = 1;

		/// Decide which gap to fill    
		if (nWidth < dWidth) {
			aspect = dWidth / nWidth;
		}
		if (nHeight < dHeight) {
			aspect = dHeight / nHeight;
		}
		nWidth *= aspect;
		nHeight *= aspect;

		/// Calculate source rectangle
		sWidth = iWidth / (nWidth / dWidth);
		sHeight = iHeight / (nHeight / dHeight);

		sx = (iWidth - sWidth) * offsetX;
		sy = (iHeight - sHeight) * offsetY;

		/// Make sure source rectangle is valid
		if (sx < 0) {
			sx = 0;
		}
		if (sy < 0) {
			sy = 0;
		}
		if (sWidth > iWidth) {
			sWidth = iWidth;
		}
		if (sHeight > iHeight) {
			sHeight = iHeight;
		}

		/// Fill image in destination rectangle
		ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	}

	// Calculate a rippled frame
	function generateFrame(ctx) {
		var obj_dict = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT),
			obj_data = obj_dict.data,
			pixel = 0;

		for (var y = 0; y < CANVAS_HEIGHT; y++) {
			for (var x = 0; x < CANVAS_WIDTH; x++) {
				var disp = (scale * 10 * (Math.sin((CANVAS_HEIGHT / (y / waves)) + (-offset)))) | 0,
					j = ((disp + y) * CANVAS_WIDTH + x + disp) * 4;

				if (j < 0) {
					pixel += 4;
					continue;
				}

				var m = j % (CANVAS_WIDTH * 4),
					n = scale * 10 * (y / waves);
				if (m < n || m > (CANVAS_WIDTH * 4) - n) {
					var sign = y < CANVAS_WIDTH / 2 ? 1 : -1;
					obj_data[pixel]   = obj_data[pixel + 4 * sign];
					obj_data[++pixel] = obj_data[pixel + 4 * sign];
					obj_data[++pixel] = obj_data[pixel + 4 * sign];
					obj_data[++pixel] = obj_data[pixel + 4 * sign];
					pixel++;
					continue;
				}

				if (orig_idata[j+3] != 0) {
					obj_data[pixel]   = orig_idata[j];
					obj_data[++pixel] = orig_idata[++j];
					obj_data[++pixel] = orig_idata[++j];
					obj_data[++pixel] = orig_idata[++j];
					pixel++;
				} else {
					obj_data[pixel]   = obj_data[pixel - CANVAS_WIDTH * 4];
					obj_data[++pixel] = obj_data[pixel - CANVAS_WIDTH * 4];
					obj_data[++pixel] = obj_data[pixel - CANVAS_WIDTH * 4];
					obj_data[++pixel] = obj_data[pixel - CANVAS_WIDTH * 4];
					pixel++;
				}
			}
		}

		return obj_dict;
	}

	// For when the image loads
	function loaded(e) {
		if (image_loaded === true || calculating === true) {
			return false;
		}

		// Reset drawing variables
		offset = 0;
		frame = 0;
		frames = [];
		max_frames = undefined;
		calculating = true;

		// Draw the image flipped vertically
		context.save();
		context.scale(1, -1);
		drawImageProp(context, image, 0, -CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();

		// Store the unaltered image data
		orig_idata = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;

		image_loaded = true;
		calculating = false;
	}

	// Determine when the image is loaded
	image.addEventListener('load', loaded, false);
	image.src = source;

	// Set rendering steps
	function step(timestamp) {
		if (last_draw === undefined) {
			last_draw = timestamp;
		}
		if (timestamp - last_draw >= 33) {
			last_draw = timestamp;

			// Generate a new frame if necessary
			if (max_frames === undefined && image_loaded === true) {
				// That's enough frames
				if (offset > speed * (6 / speed)) {
					offset = 0;
					max_frames = frame - 1;
					frame = 0;

				// Keep making frames
				} else {
					offset += speed;
					frames.push(generateFrame(context));
				}

				// Draw the frame
				context.putImageData(frames[frame], 0, 0);
				frame++;

			// Run this if there are already enough precalculate frames
			} else {
				if (max_frames === undefined || frame < max_frames) {
					frame++;
				} else {
					frame = 0;
				}
				if (frames[frame] !== undefined) {
					context.putImageData(frames[frame], 0, 0);
				}
			}
		}
		window.requestAnimationFrame(step);
	}
	window.requestAnimationFrame(step);

	// Force recalculation on resize
	window.addEventListener('resize', function(e){
		if (canvas.clientHeight === CANVAS_HEIGHT && canvas.clientWidth === CANVAS_WIDTH) {
			return false;
		}

		image_loaded = false;
		loaded(e);
	});
}
var ripple = document.querySelector('#ripple'),
	lake = new Laker(ripple, ripple.dataset.image);
