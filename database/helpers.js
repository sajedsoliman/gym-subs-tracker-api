// given a record that has the (_id) property on it then the function will turn it into id
function addIdProperty(record) {
	const { _id, ...restProps } = record;

	return { ...restProps, id: _id };
}

function getDateFromDateObject({ day, year, month }) {
	return new Date(year, month, day);
}

module.exports = {
	addIdProperty,
	getDateFromDateObject,
};
