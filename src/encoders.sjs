import { createHash } from 'crypto'

fn formatDate(date) {
  var timezone = (date.timeZoneoffset || date.getTimezoneOffset()) / 60;
  var seconds = Math.floor(date.getTime() / 1000);
  return seconds + " " + (timezone > 0 ? "-0" : "0") + timezone + "00";
}

fn safe(string) {
  return string.replace(/(?:^[\.,:;<>"']+|[\0\n<>]+|[\.,:;<>"']+$)/gm, "");
}

fn makeHash (buffer) {
	var shasum = createHash('sha1');
	shasum.update(buffer);
	return shasum.digest('hex')
}

module.exports = {~formatDate, ~safe, ~makeHash}
