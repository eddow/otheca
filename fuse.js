const {
	Sparky, FuseBox, UglifyJSPlugin, TypeScriptHelpers, CSSPlugin, EnvPlugin, VuePlugin,
	JSONPlugin, BabelPlugin, HotReloadPlugin, QuantumPlugin
} = require('fuse-box');
let producer;
let production = false;

Sparky.task("build", ()=> {
	const fuse = FuseBox.init({
		homeDir: "src",
		output: "dist/$name.js",
		package: 'theca',
		plugins: [
			TypeScriptHelpers(),
			EnvPlugin({NODE_ENV: production ? "production" : "development"}),
			CSSPlugin(), production && UglifyJSPlugin(),
			VuePlugin(),
			JSONPlugin()
		],
		hash: production,
		//hmr: true,
		//sourceMaps: {project: true, vendor: false},
		//cache: false,
		cache: !production,
		alias: {
			models: "~/common/models",
			common: "~/common",
			bluebird: 'bluebird/js/release/bluebird.js',
			vue: 'vue/dist/vue.js'
		},
		debug: true, log: true
	});

	fuse.bundle("server/app")
		.watch("(server|common|config)/**")
		//.sourceMaps(true)
		.alias('config', '~/config/server')
		.instructions("> [server/index.ts] +[common/**/*.*] -*.d.ts")
		.completed(proc=> {
			proc.require();
		});

	//fuse.bundle("server/vendor").instructions(`~ server/*.ts +tslib`);


	const app = fuse.bundle("client/app")
    .watch("(client|common|config)/**")
		//.sourceMaps(true)
		.alias('config', '~/config/client')
		//.plugin(HotReloadPlugin({port: 4445}))
    .instructions('!> [client/index.ts] +[client/routes/*.vue] +[common/**/*.*] - *.d.ts');
	//if (!production) app.hmr();

	const vendor = fuse.bundle("client/vendor")
		//.instructions(`~ client/*.ts +tslib`);
		.instructions(`~ client/index.ts +tslib`);
	//if (!production) vendor.hmr();

	return fuse.run().then((fuseProducer)=> {
		producer = fuseProducer;
	});
});

// main task
Sparky.task("default", ["clean", "build", "make-html"], ()=> {});
Sparky.task("on", ["build", "make-html"], ()=> {});	//node fuse on

// wipe it all
Sparky.task("clean", ()=> {
	return Promise.all([
		Sparky.src(".fusebox/*").clean(".fusebox/").exec(),
		Sparky.src("dist/*").clean("dist/").exec()
	]);
});

// copy and replace HTML
Sparky.task("make-html", ()=> {
	return Sparky.src("src/index.html")
		.file("*", file=> {
			const vendor = producer.bundles.get("client/vendor"),
				app = producer.bundles.get("client/app");
			// get generated bundle names
			file.template({
				//context.output.lastGeneratedFileName returns the .js.map file name
				vendor: vendor.context.output.lastPrimaryOutput.filename,
				app: app.context.output.lastPrimaryOutput.filename
			});
		})
		.dest("dist/client/$name")
});

Sparky.task("set-production-env", ()=> production = true);
Sparky.task("dist", ["clean", "set-production-env", "build", "make-html"], ()=> {})
