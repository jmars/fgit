import indexOf from './util/indexof'
import { parseAscii, parseDec, parseOct, parseToHex } from './parsers'
import { deflate, inflate } from 'zlib'
import { createHash } from 'crypto'
import pathCmp from './util/pathCmp.js'
import { Trait } from 'light-traits'
import path from 'path'
import co from 'co'
import thunkify from 'thunkify'
import Frame from './types/frame'
import { Blob, Tag, Tree, Commit } from './types/frame'
import Person from './types/person'
import mkdirp from './util/mkdirp'

newtype Repo {
	fs: Object
}

impl Repo {
	read(hash, cb) {
		if (!cb) return @read.bind(this, hash);
		var [prelude, name] = [hash.slice(0, 2), hash.slice(2)];
		var file = path.join('/objects/', prelude, name);
		@fs.readFile(file, |err, buf|{
			if (err) return cb(err);
			Frame.fromBuffer(buf)(|err,obj|{cb(err,obj)})
		})
	}

	write(obj, cb) {
		if (!cb) return @write.bind(this, obj);
		Frame.toBuffer(obj, |err, result|{
			if (err) return cb(err);
			var [hash, data] = result;
			var [prelude, name] = [hash.slice(0, 2), hash.slice(2)];
			var file = path.join('/objects', prelude, name);
			mkdirp(@fs, path.dirname(file), |err|{
				if (err) return cb(err);
				@fs.writeFile(file, data, |err|{
					cb(err, hash)
				})
			})
		})
	}

	setHead(ref, cb) {
		if (!cb) return @setHead.bind(this, ref);
		var content = 'ref: ' + ref;
		@fs.writeFile('/HEAD', content, cb)
	}

	createRef(p, hash, cb) {
		if (!cb) return @createRef.bind(this, p, hash);
		mkdirp(@fs, path.dirname(p), |err|{
			if (err) return cb(err);
			@fs.writeFile(p, hash, cb)
		})
	}

	removeRef(path, cb) {
		if (!cb) return @removeRef.bind(this, path);
		@fs.unlink(path, cb)
	}

	readRef(path, cb) {
		if (!cb) return @readRef.bind(this, path);
		@fs.readFile(path, 'utf8', cb)
	}
}

module.exports = {
	~Repo,
	~Blob,
	~Commit,
	~Person,
	~Tree,
	~Tag
}
