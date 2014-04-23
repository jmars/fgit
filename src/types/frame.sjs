import Person from './person.js'
import { isHash, validType } from '../checks.js'
import { inflate, deflate } from 'zlib'
import { makeHash } from '../encoders.js'

data Frame {
	Blob {
		data: Buffer
	},
	Tree {
		entries: Object
	},
	Commit {
		tree: isHash,
		parents: Array,
		message: String,
		author: Person,
		committer: Person
	},
	Tag {
		object: isHash,
		type: validType,
		tag: String,
		tagger: Person,
		message: String
	}
}

Frame.getType = function {
	case Blob => 'blob'
	case Tree => 'tree'
	case Commit => 'commit'
	case Tag => 'tag'
}

Frame.fromBuffer = fn (buf, cb) {
	if (!cb) return Frame.fromBuffer.bind(Frame, buf);
	inflate(buf, function {
		case (null, FrameParser{body}) => {
			cb(null, body)
		}
		case * => {
			cb(new Error('Not a valid frame buffer'))
		}
	})
}

Frame.toBuffer = fn (x, cb) {
	if (!cb) return Frame.toBuffer.bind(Frame, x);
	var body = x.toBuffer();
	var type = Frame.getType(x);
	var buf = Buffer.concat([
		new Buffer(type + ' ' + body.length + '\0'),
		body
	]);
	deflate(buf, |err, data|{
		cb(null, [makeHash(data), data])
	})
}

Frame.Blob = require('./blob')(Blob);
Frame.Tree = require('./tree')(Tree);
Frame.Commit = require('./commit')(Commit);
Frame.Tag = require('./tag')(Tag);

var FrameParser = require('../parser')(Frame);

module.exports = Frame
