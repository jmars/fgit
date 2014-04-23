import indexOf from '../util/indexof'
import parseAscii from '../parsers/ascii'
import parseToHex from '../parsers/hex'
import pathCmp from '../util/pathcmp'

module.exports = fn (Tree) {
	impl Tree {
		toBuffer() {
			var chunks = [];
			var tree = Object.keys(@entries).map(|name|{
				var entry = @entries[name];
				entry.name = name;
				return entry
			});
			tree.sort(pathCmp).forEach(|entry|{
				chunks.push(
					new Buffer(entry.mode.toString(8) + ' ' + entry.name + '\0'),
					new Buffer(entry.hash, 'hex')
				)
			});
			return Buffer.concat(chunks)
		}
	}

	Tree.fromBuffer = fn (body) {
		var i = 0;
		var length = body.length;
		var start;
		var mode;
		var name;
		var hash;
		var tree = {}
		while (i < length) {
			start = i;
			i = indexOf(body, 0x20, start);
			if (i < 0) throw new SyntaxError("Missing space");
			mode = parseInt(body.slice(start, i++).toString());
			start = i;
			i = indexOf(body, 0x00, start);
			name = parseAscii(body, start, i++);
			hash = parseToHex(body, i, i += 20);
			tree[name] = {
				mode: mode,
				hash: hash
			};
		}
		return Tree.create({
			entries: tree
		})
	}

	return Tree
}
