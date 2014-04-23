import { parseAscii } from '../parsers'
import indexOf from '../util/indexof'
import Person from './person'

module.exports = fn (Tag) {
	impl Tag {
		toBuffer() {
			var tag = this;
			var str = "object " + tag.object +
				"\ntype " + tag.type +
				"\ntag " + tag.tag +
				"\ntagger " + tag.tagger.toBuffer() +
				"\n\n" + tag.message;
			return new Buffer(str);
		}
	}

	Tag.fromBuffer = fn (body) {
		var i = 0;
		var start;
		var key;
		var tag = {};
		while (body[i] !== 0x0a) {
			start = i;
			i = indexOf(body, 0x20, start);
			if (i < 0) throw new SyntaxError("Missing space");
			key = parseAscii(body, start, i++);
			start = i;
			i = indexOf(body, 0x0a, start);
			if (i < 0) throw new SyntaxError("Missing linefeed");
			var value = parseAscii(body, start, i++);
			if (key === "tagger") value = Person.fromBuffer(value);
			tag[key] = value;
		}
		i++;
		tag.message = parseAscii(body, i, body.length);
		return Tag.create(tag);
	}

	return Tag
}
