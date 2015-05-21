// Set up variables
var devbox = document.querySelector('#developer'),
	devtails = document.querySelector('#developer-details'),
	writer = document.querySelector('#writer'),
	writails = document.querySelector('#writer-details'),
	header = document.querySelector('#header'),
	amper = document.querySelector('#amper'),
	closer = document.querySelector('#closer'),
	ripple = document.querySelector('#ripple'),

	// InstaFeed stuff
	feed = document.querySelector('#instafeed'),
	ftemplate = document.querySelector('#instafeed-template').innerHTML,

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
	var hash = window.location.hash;

	if (hash === '#writer') {
		setDisplay(1);
	} else if (hash === '#developer') {
		setDisplay(2);
	} else if (hash === '#' || hash === '') {
		setDisplay(0);
	}
}
hashCheck();
window.addEventListener('hashchange', hashCheck);

// Remove all position classes
function clearPosition(elem) {
	// Can't do multiple arguments for remove with IE11
	elem.classList.remove('leftest');
	elem.classList.remove('lefter');
	elem.classList.remove('left');
	elem.classList.remove('right');
	elem.classList.remove('righter');
	elem.classList.remove('rightest');
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

// Allow keyboard navigation
document.addEventListener('keydown', function(e){
	var k = e.keyCode || e.which;

	if (k === 27) {
		window.location.hash = '#';
		e.preventDefault();
	} else if (k === 37) {
		if (window.location.hash === '#developer') {
			window.location.hash = '#';
		} else {
			window.location.hash = '#writer';
		}
	} else if (k === 39) {
		if (window.location.hash === '#writer') {
			window.location.hash = '#';
		} else {
			window.location.hash = '#developer';
		}
	} else if (k === 40) {
		window.location = '#contact';
	}
});

// Make the lake ripples
if (window.Worker !== undefined) {
	var lake = new Laker(ripple, ripple.dataset === undefined ? ripple.getAttribute('image') : ripple.dataset.image);
}

// Create the Instagram feed
var html = '';
for (var i = 0, l = feed_data.length; i < l; i++) {
	html += ftemplate.replace(/\[\[link\]\]/g, feed_data[i].link).replace(/\[\[caption\]\]/g, feed_data[i].caption).replace(/\[\[image\]\]/g, feed_data[i].image);
}
feed.innerHTML = html;
