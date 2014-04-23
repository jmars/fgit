import indexOf from './util/indexof'
import { parseDec, parseAscii } from './parsers'

module.exports = fn (Frame) {
	var {Blob, Tag, Tree, Commit} = Frame;

	var FrameParser = {
		hasInstance: fn (x) {
			return x instanceof Buffer ? true : false
		},

		match: function {
			case ['blob', body] => Blob.fromBuffer(body)
			case ['tag', body] => Tag.fromBuffer(body)
			case ['tree', body] => Tree.fromBuffer(body)
			case ['commit', body] => Commit.fromBuffer(body)
		},

		unapply: fn (x) {
			return [FrameParser.deframe(x)]
		},

		unapplyObject: fn (x) {
			return {body: FrameParser.match(FrameParser.deframe(x))}
		},

		deframe: fn (buffer) {
			var space = indexOf(buffer, 0x20);
			if (space < 0) throw new Error("Invalid git object buffer");
			var nil = indexOf(buffer, 0x00, space);
			if (nil < 0) throw new Error("Invalid git object buffer");
			var body = buffer.slice(nil + 1);
			var size = parseDec(buffer, space + 1, nil);
			if (size !== body.length) throw new Error("Invalid body length.");
			return [
				parseAscii(buffer, 0, space),
				body
			];
		}
	}

	return FrameParser
}
