import { parseAscii } from '../parsers'
import indexOf from '../util/indexof'
import Person from './person.js'

module.exports = fn (Commit) {
	impl Commit {
		toBuffer() {
			var commit = this;
			var parents = commit.parents;
			var str = "tree " + commit.tree;
			for (var i = 0, l = parents.length; i < l; ++i) {
				str += "\nparent " + parents[i];
			}
			str += "\nauthor " + commit.author.toBuffer() +
						 "\ncommitter " + commit.committer.toBuffer() +
						 "\n\n" + commit.message;
			return new Buffer(str);
		}
	}

	Commit.fromBuffer = fn (body) {
		var i = 0;
		var start;
		var key;
		var parents = [];
		var commit = {
			tree: "",
			parents: parents,
			author: "",
			committer: "",
			message: ""
		};
		while (body[i] !== 0x0a) {
			start = i;
			i = indexOf(body, 0x20, start);
			if (i < 0) throw new SyntaxError("Missing space");
			key = parseAscii(body, start, i++);
			start = i;
			i = indexOf(body, 0x0a, start);
			if (i < 0) throw new SyntaxError("Missing linefeed");
			var value = parseAscii(body, start, i++);
			if (key === "parent") {
				parents.push(value);
			}
			else {
				if ((key === "author") || (key === "committer")) {
					value = Person.fromBuffer(value)
				}
				commit[key] = value;
			}
		}
		i++;
		commit.message = parseAscii(body, i, body.length);
		return Commit.create(commit)
	}

	return Commit
}
