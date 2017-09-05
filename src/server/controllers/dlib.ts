import * as walk from 'walk'
import {path, extensions} from 'config'
import {join} from 'path'
import {statSync, unlinkSync, ensureDir, existsSync} from 'fs-extra'
import * as watch from 'node-watch'
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
export var watcher = null;
function endHandler() {
	libFiles = tmp;
	watcher = watch(path.lib, {recursive: true}, function(event, filename) {
		var stat, rel = filename.substr(path.lib.length);
		switch(event) {
			case 'update':
				stat = statSync(filename);
				if(stat.isFile()) {
					if(~'\\/'.indexOf(rel[0])) rel = rel.substr(1);
					console.log('Added: ', rel);
					libFiles[rel] = {
						name: /[^\\\/]*$/.exec(rel)[0],
						size: stat.size
					};
				}
				break;
			case 'remove':
				delete libFiles[rel];
				console.log('Deleted: '+rel);
				break;
		}
	});
}
export function unwatchDlib() {
	if(watcher) {
		watcher.close();
		watcher = null;
	}
}
export function sendFile(res, rel) {
	res.sendFile(join(path.lib, rel));
}

export function delFile(res, rel) {
	var fn = join(path.lib, rel);
	unlinkSync(fn);
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
				upath = file.path.substr(0, file.path.length-file.filename.length);
			ext = ext?'.'+ext:'';
			while(existsSync(upath+fname+addition+ext))
				addition = '-'+(++add);
			fname += addition+ext;
      return fname;
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