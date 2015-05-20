var self = this;

function generateFrame(new_data, old_data, width, height, scale, waves, offset) {
	var data = new_data.data,
		pixel = 0;

	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var disp = (scale * 10 * (Math.sin((height / (y / waves)) + (-offset)))) | 0,
				j = ((disp + y) * width + x + disp) * 4;

			if (j < 0) {
				pixel += 4;
				continue;
			}

			var m = j % (width * 4),
				n = scale * 10 * (y / waves);
			if (m < n || m > (width * 4) - n) {
				var sign = y < width / 2 ? 1 : -1;

				data[pixel]   = data[pixel + 4 * sign];
				data[++pixel] = data[pixel + 4 * sign];
				data[++pixel] = data[pixel + 4 * sign];
				data[++pixel] = data[pixel + 4 * sign];
				pixel++;
				continue;
			}

			if (old_data[j+3] != 0) {
				data[pixel]   = old_data[j];
				data[++pixel] = old_data[++j];
				data[++pixel] = old_data[++j];
				data[++pixel] = old_data[++j];
				pixel++;
			} else {
				data[pixel]   = data[pixel - width * 4];
				data[++pixel] = data[pixel - width * 4];
				data[++pixel] = data[pixel - width * 4];
				data[++pixel] = data[pixel - width * 4];
				pixel++;
			}
		}
	}

	return new_data;
}

onmessage = function(e){
	self.postMessage({
		new_data: generateFrame(e.data.new_data, e.data.old_data, e.data.width, e.data.height, e.data.scale, e.data.waves, e.data.offset)
	});
};
