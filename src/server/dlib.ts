import * as walk from 'walk'
import {lib, extensions} from 'config'
import {join} from 'path'
const rexExt = new RegExp('\\.('+extensions.join('|')+')$');
var walker  = walk.walk(lib, {followLinks: false})
export var libFiles = null;
var tmp = {};
walker.on("file", fileHandler);
walker.on("errors", errorsHandler); // plural
walker.on("end", endHandler);
function fileHandler(root, fileStat, next) {
	var rel = root.substring(lib.length+1).replace(/\\/g, '/');
	rel += (rel?'/':'')+fileStat.name;
	if('file'=== fileStat.type && rexExt.test(fileStat.name))
		tmp[rel] = {
			name: fileStat.name,
			size: fileStat.size
		};
	next();
}

function errorsHandler(root, nodeStatsArray, next) {
  nodeStatsArray.forEach(function (n) {
    console.error("[ERROR] " + n.name)
    console.error(n.error.message || (n.error.code + ": " + n.error.path));
  });
  next();
}

function endHandler() {
  libFiles = tmp;
}

export function sendFile(res, rel) {
	res.sendFile(join(lib, rel));
}