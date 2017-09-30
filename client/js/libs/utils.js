

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


export function formObject($form) {

	// TODO: Get a FormData polyfill

	let data = new FormData($form);

	data = Array.from(data.entries()).reduce((carryObject, field) => {
		carryObject[field[0]] = field[1];
		return carryObject;
	}, {});

	console.log(data);

	return data;
}
