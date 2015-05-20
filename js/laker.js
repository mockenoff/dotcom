function Laker(canvas, source) {
	var self = this,
		// Basic settings
		settings = {
			speed: 0.75,
			scale: 0.5,
			waves: 6
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
		lworker = new Worker('js/laker_worker.js'),
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
		if (canvas.clientHeight === CANVAS_HEIGHT && canvas.clientWidth === CANVAS_WIDTH) {
			return false;
		}

		CANVAS_WIDTH = canvas.width = canvas.clientWidth;
		CANVAS_HEIGHT = canvas.height = canvas.clientHeight;

		image_loaded = false;
		loaded(e);
	}
	CANVAS_WIDTH = canvas.width = canvas.clientWidth;
	CANVAS_HEIGHT = canvas.height = canvas.clientHeight;
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

	// How to handle the worker response
	lworker.onmessage = function(e){
		calculating = false;

		frames.push(e.data.new_data);
		context.putImageData(e.data.new_data, 0, 0);
		frame++;
	};

	// Set rendering steps
	function step(timestamp) {
		if (last_draw === undefined) {
			last_draw = timestamp;
		}
		if (timestamp - last_draw >= 33) {
			last_draw = timestamp;

			// Generate a new frame if necessary
			if (calculating === false) {
				if (max_frames === undefined && image_loaded === true) {
					// That's enough frames
					if (offset > speed * (6 / speed)) {
						offset = 0;
						max_frames = frame - 1;
						frame = 0;

					// Keep making frames
					} else {
						offset += speed;
						calculating = true;
						lworker.postMessage({
							waves: waves,
							scale: scale,
							offset: offset,
							width: CANVAS_WIDTH,
							height: CANVAS_HEIGHT,
							new_data: context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT),
							old_data: orig_idata
						});
					}

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
		}
		window.requestAnimationFrame(step);
	}
	window.requestAnimationFrame(step);
}
