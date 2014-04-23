module.exports = fn (Blob) {
	impl Blob {
		toBuffer() {
			return @data;
		}
	}

	Blob.fromBuffer = fn (buf) {
		return Blob.create({
			data: buf
		})
	}

	return Blob;
}
