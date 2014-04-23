import path from 'path'
import thunkify from 'thunkify'
import co from 'co'

var mkdirp = co(function *(fs, p) {
	var mkdir = thunkify(fs.mkdir);
	var exists = |done|{fs.exists(p, done.bind(null, null))};
	p = path.normalize(p);
	if (p[p.length-1] === '/') p = p.slice(0, p.length-1);
	if (!(yield exists)) {
		yield thunkify(mkdirp)(fs, path.dirname(p))
		yield mkdir(p);
	}
});

module.exports = mkdirp
