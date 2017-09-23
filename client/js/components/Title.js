
export default ({ children }) => {

	let title = children.join(' ');
	const $title = document.querySelector('title');

	const titlePostfix = $title.dataset.postfix;
	if(titlePostfix) {
		title = `${title} | ${titlePostfix}`;
	}

	$title.textContent = title;

	return null;
};
