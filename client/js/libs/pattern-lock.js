

export default class PatternLock {

	static wordMap = [
		[
			'adipi#@$$%#scing',
			'era{}}{}}}t',
			'porta',
			'lobortis',
			'ullamcorper',
		], [
			'fo^$*@!#x',
			'jum[.,]ps',
			'ov#$^er',
			'bri;24dge',
			'dea=-=th',
		], [
			'fancy',
			'planes',
			'fool92ish',
			'man',
			'juice',
		], [
			'nun23c',
			'vehicew6ula',
			'lectus',
			'ferment789um',
			'susc>"ipit',
		], [
			'lorem',
			'ipsum',
			'do*(*)(lor',
			'sit',
			'amet',
		]
	];


	static patternToWords(nodes) {
		const string= nodes.reduce((string, node) =>
			PatternLock.wordMap[node.row - 1][node.col - 1] + string, '');
		return string;
	}

	static hashCode(str) {

		if(!str.length)
			return '';

		const hash=
			str
				.split('')
				.reduce((a, b) => {
					a= ( (a << 5) - a ) + b.charCodeAt(0);
					return a & a;
				}, 0);

		return btoa(hash + '');
	}


	static get DEVICE_PIXEL_RATIO() {

		const ctx = document.createElement('canvas').getContext('2d');
		const devicePixelRatio = window.devicePixelRatio || 1;
		const backingStorePixelRatio =
			ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.msBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio || 1;

		return devicePixelRatio / backingStorePixelRatio;
	}


	// Default theme
	THEME = {
		accent: '#1abc9c',
		primary: '#ffffff',
		bg: '#2c3e50',
		dimens: {
			line_width: 6,
			node_radius: 28,
			node_core: 8,
			node_ring: 1,
		}
	}


	constructor(config) {

		this.$canvas =
			(typeof config.el === 'string')?
				document.querySelector(config.el): config.el;
		this.ctx = this.$canvas.getContext('2d');

		const ratio = PatternLock.DEVICE_PIXEL_RATIO;

		this.dimens = Object.assign({}, config.dimens);

		this.$canvas.width = this.dimens.width * ratio;
		this.$canvas.height = this.dimens.height * ratio;
		this.$canvas.style.width = this.dimens.width + 'px';
		this.$canvas.style.height = this.dimens.height + 'px';
		this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

		this.setInitialState();
	}


	set onPatternComplete(cb) {
		this._patternCompleteHandler= cb;
	}


	/**
	 * Set the pattern lock screen theme
	 * 
	 * @param {Object}   theme    Theme to add to defaults
	 *
	 * @return {Object}           Full theme
	 */
	setTheme(theme) {

		this.THEME.dimens= Object.assign({}, this.THEME.dimens, theme.dimens || {});
		theme.dimens= this.THEME.dimens;
		this.THEME= Object.assign({}, this.THEME, theme);

		return this.THEME;
	}


	/**
	 * Attach event listeners and start frame loops
	 */
	start() {

		// Binding context
		this._mouseStartHandler= this._mouseStartHandler.bind(this);
		this._mouseEndHandler= this._mouseEndHandler.bind(this);
		this._mouseMoveHandler= this._mouseMoveHandler.bind(this);
		this.renderLoop= this.renderLoop.bind(this);
		this.calculationLoop= this.calculationLoop.bind(this);


		// Attach event handlers
		this.$canvas.addEventListener('mousedown', this._mouseStartHandler);
		this.$canvas.addEventListener('mouseup', this._mouseEndHandler);
		window.addEventListener('mousemove', this._mouseMoveHandler);
		this.$canvas.addEventListener('touchstart', this._mouseStartHandler);
		this.$canvas.addEventListener('touchend', this._mouseEndHandler);
		window.addEventListener('touchmove', this._mouseMoveHandler);

		// Start frame loops
		requestAnimationFrame(this.renderLoop);
		requestAnimationFrame(this.calculationLoop);
	}


	/**
	 * Set the initial state
	 */
	setInitialState() {

		// Canvas position and dimens
		requestAnimationFrame(() => this.bounds = this.$canvas.getBoundingClientRect());

		this.coordinates= null;
		this.selectedNodes= [];
	}

	reset() {
		this._isDragging = true;

		this.setInitialState();
		this.calculationLoop(false);
		this.renderLoop(false);

		this._isDragging = false;
	}

	forceRender() {
		this._isDragging = true;
		this.renderLoop(false);
		this._isDragging = false;
	}


	/**
	 * Mouse start handler
	 */
	_mouseStartHandler(e) {
		if(e) e.preventDefault();

		this.reset();

		this._isDragging= true;
	}

	/**
	 * Mouse end handler
	 */
	_mouseEndHandler(e) {
		if(e) e.preventDefault();

		this.coordinates= null;
		this.renderLoop(false);

		this._isDragging= false;

		if(typeof this._patternCompleteHandler === 'function') {
			this._patternCompleteHandler(this.selectedNodes.slice(0));
		}
	}


	/**
	 * Mouse move handler
	 */
	_mouseMoveHandler(e) {

		e.preventDefault();

		if(this._isDragging) {

			const mousePoint= {
				x: (e.clientX || e.clientX == 0)? e.clientX: e.touches[0].clientX,
				y: (e.clientY || e.clientY == 0)? e.clientY: e.touches[0].clientY,
			};

			mousePoint.x-= this.bounds.left;
			mousePoint.y-= this.bounds.top;

			if(
				mousePoint.x <= this.dimens.width && mousePoint.x > 0 &&
				mousePoint.y <= this.dimens.height && mousePoint.y > 0
			) {
				this.coordinates= mousePoint;
			} else {
				this._mouseEndHandler();
			}
		}
	}


	/**
	 * Check if the given node is already selected
	 * 
	 * @param  {Object}  targetNode  Node to check
	 * 
	 * @return {Boolean}             True if the node is selected
	 */
	isSelected(targetNode) {

		return !!this.selectedNodes.find(
			node => (
				node.row == targetNode.row &&
				node.col == targetNode.col
			)
		);
	}


	/**
	 * Calculate the state of the lock for the next frame
	 * 
	 * @param  {Boolean} runLoop  Start it as a loop if true
	 */
	calculationLoop(runLoop= true) {

		if(this._isDragging && this.coordinates) {

			this.forEachNode((x, y) => {

				const dist= Math.sqrt(
					Math.pow(this.coordinates.x - x, 2) + 
					Math.pow(this.coordinates.y - y, 2)
				);

				if(dist < this.THEME.dimens.node_radius + 1) {

					const row= x/this.interval.x;
					const col= y/this.interval.y;

					const currentNode= { row, col };

					if(!this.isSelected(currentNode)) {
						this.selectedNodes.push(currentNode);
						return false;
					}
				}
			});
		}

		if(runLoop) {
			requestAnimationFrame(this.calculationLoop);
		}
	}


	/**
	 * Render the state of the lock
	 * 
	 * @param  {Boolean} runLoop  Start it as a loop if true
	 */
	renderLoop(runLoop= true) {

		if(this._isDragging) {

			// Clear the canvas(Redundant)
			this.ctx.clearRect(0, 0, this.dimens.width, this.dimens.height);

			this.renderGrid();

			// Plot all the selected nodes
			const lastNode=
				this.selectedNodes.reduce((prevNode, node) => {

					if(prevNode) {

						const point1= { x: node.row*this.interval.x, y: node.col*this.interval.y };
						const point2= { x: prevNode.row*this.interval.x, y: prevNode.col*this.interval.y };

						// Make the two selected nodes bigger
						this.drawNode(
							point1.x, point1.y,
							this.THEME.accent, this.THEME.primary,
							this.THEME.dimens.node_ring + 3
						);
						this.drawNode(
							point2.x, point2.y,
							this.THEME.accent, this.THEME.primary,
							this.THEME.dimens.node_ring + 3
						);

						// Join the nodes
						this.joinNodes(
							prevNode.row, prevNode.col,
							node.row, node.col
						);
					}

					return node;
				}, null);


			if(lastNode && this.coordinates) {

				// Draw the last node
				this.drawNode(
					lastNode.row * this.interval.x, lastNode.col * this.interval.y,
					this.THEME.accent, this.THEME.primary,
					this.THEME.dimens.node_ring + 6
				);

				// Draw a line between last node to the current drag position
				this.joinNodes(
					lastNode.row * this.interval.x, lastNode.col * this.interval.y,
					this.coordinates.x, this.coordinates.y,
					true  // IsCoordinates instead of row and column position
				);
			}
		}

		if(runLoop) {
			requestAnimationFrame(this.renderLoop);
		}
	}



	/**
	 * Generate the grid of nodes
	 * 
	 * @param  {Number} rows  The number of horizontal nodes
	 * @param  {Number} cols  The number of vertical nodes
	 */
	generateGrid(rows, cols) {

		this.rows= rows;
		this.cols= cols;

		this.renderGrid();
	}


	/**
	 * Render the grid to the canvas
	 */
	renderGrid() {

		this.ctx.fillStyle= this.THEME.bg;
		this.ctx.fillRect(0, 0, this.dimens.width, this.dimens.height);

		this.interval= {
			x: this.dimens.width/(this.rows + 1),
			y: this.dimens.height/(this.cols + 1),
		};

		// Draw all the nodes
		this.forEachNode(this.drawNode.bind(this));
	}



	/**
	 * ForEach iterator for all nodes on the grid
	 * 
	 * @param  {Function} callback
	 */
	forEachNode(callback) {

		const xGrid= Array(this.rows).fill(this.interval.x);
		const yGrid= Array(this.cols).fill(this.interval.y);

		const breakException= new Error('Break Exception');
		
		try {

			yGrid.reduce((y, dy) => {

				xGrid.reduce((x, dx) => {

					// If the callback returns false, break out of the loop
					if(callback(x, y) === false)
						throw breakException;

					return x + dx;

				}, this.interval.x);

				return y + dy;

			}, this.interval.y);

		} catch(e) {
			if(e !== breakException) throw e;
		}
	}


	/**
	 * Draw a node
	 * 
	 * @param  {Number} x
	 * @param  {Number} y
	 * @param  {String} centerColor
	 * @param  {String} borderColor
	 * @param  {Number} size       
	 */
	drawNode(x, y, centerColor=this.THEME.primary, borderColor=this.THEME.primary, size=this.THEME.dimens.node_ring) {

		// Config
		this.ctx.lineWidth= size;
		this.ctx.fillStyle= centerColor;
		this.ctx.strokeStyle= borderColor;

		// Draw inner circle
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.THEME.dimens.node_core, 0, Math.PI*2);
		this.ctx.fill();

		// Draw outer ring
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.THEME.dimens.node_radius, 0, Math.PI*2);
		this.ctx.stroke();
	}


	/**
	 * Join two nodes with a line
	 * 
	 * @param  {Number}  row1
	 * @param  {Number}  col1
	 * @param  {Number}  row2
	 * @param  {Number}  col2
	 * @param  {Boolean} isCoordinates  If true, will calculate as pixels
	 */
	joinNodes(row1, col1, row2, col2, isCoordinates=false) {

		let factor= this.interval;

		if(isCoordinates) {
			factor= { x: 1, y: 1 };
		}

		const point1= { x: factor.x*row1, y: factor.y*col1 };
		const point2= { x: factor.x*row2, y: factor.y*col2 };

		// Config
		this.ctx.lineWidth= this.THEME.dimens.line_width;
		this.ctx.strokeStyle= this.THEME.accent;
		this.ctx.lineCap= 'round';

		// Draw line
		this.ctx.beginPath();
		this.ctx.moveTo(point1.x, point1.y);
		this.ctx.lineTo(point2.x, point2.y);
		this.ctx.stroke();
	}
}
