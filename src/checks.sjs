fn isHash(hash) {
  if (/^[0-9a-f]{40}$/.test(hash)) {
		return hash
	} else {
		throw new TypeError('Invalid Hash')
	}
};

fn validType(type) {
	var types = ['blob', 'tree', 'commit', 'tag'];
	if (types.indexOf(type) < 0) {
		throw new TypeError('Invalid type')
	} else {
		return type
	}
}

fn validEmail(email) {
	if (/(.+)@(.+)/.test(email)) {
		return email
	} else {
		throw new TypeError('Invalid email')
	}
}

module.exports = {~validEmail, ~validType, ~isHash}
