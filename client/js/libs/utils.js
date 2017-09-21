

// Babel doesnt do the class extends right
// Makes instanceof operator work
export function Extendable(cls) {

	function Extendable() {
		cls.apply(this, arguments);
	}

	Extendable.prototype = Object.create(cls.prototype);
	Object.setPrototypeOf(Extendable, cls);

	return Extendable;
}
