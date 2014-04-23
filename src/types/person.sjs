import { validEmail } from '../checks.js'
import { safe, formatDate } from '../encoders.js'

newtype Person {
	name: String,
	email: validEmail,
	date: Date
}

impl Person {
	toBuffer() {
		return safe(@name) +
			" <" + safe(@email) + "> " +
			formatDate(@date);
	}
}

Person.fromBuffer = fn (buf) {
	var string = buf.toString();
  var match = string.match(/^([^<]*) <([^>]*)> ([^ ]*) (.*)$/);
  if (!match) throw new Error("Improperly formatted person string");
  var sec = parseInt(match[3], 10);
  var date = new Date(sec * 1000);
  date.timeZoneoffset = parseInt(match[4], 10) / 100 * -60;
  return Person.create({
    name: match[1],
    email: match[2],
    date: date
  });
}

module.exports = Person;
