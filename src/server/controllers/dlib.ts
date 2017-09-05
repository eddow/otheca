import * as walk from 'walk'
import {path, extensions} from 'config'
import {join} from 'path'
import {unlinkSync, ensureDir, existsSync} from 'fs-extra'
import * as Upload from 'upload-file'
const rexExt = new RegExp('\\.('+extensions.join('|')+')$');
var walker  = walk.walk(path.lib, {followLinks: false})
export var libFiles = null;
var tmp = {};
walker.on("file", fileHandler);
walker.on("errors", errorsHandler); // plural
walker.on("end", endHandler);
function fileHandler(root, fileStat, next) {
	var rel = root.substring(path.lib.length+1).replace(/\\/g, '/');
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
	res.sendFile(join(path.lib, rel));
}

export function delFile(res, rel) {
	var fn = join(path.lib, rel);
	unlinkSync(fn);
	delete libFiles[rel];
	console.log('Deleted: '+fn);
	res.status(204).send();
}

export function uplFiles(req, res) {
	var dest = join(path.lib, path.uploads);
	ensureDir(dest);
  var upload = new Upload({
    dest,
    //maxFileSize: 100 * 1024,
    //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
    rename: function(name, file) {
			var anl = /^(.*)\.([^\.]*)$/.exec(file.filename),
				fname = anl && anl[1], ext = anl && anl[2],
				add = 0, addition = '',
				path = file.path.substr(0, file.path.length-file.filename.length);
			ext = ext?'.'+ext:'';
			while(existsSync(path+fname+addition+ext))
				addition = '-'+(++add);
      return fname+addition+ext;
    }
  });

  upload.on('end', function(fields, files) {
    res.send('ok')
  });

  upload.on('error', function(err) {
		console.error(err);
    res.send(err);
  });

  upload.parse(req);
}