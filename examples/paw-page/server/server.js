const Koa = require('koa');
const app = new Koa();
const KoaRouter = require('koa-router');
const fs = require('fs');

const path = require('path');

const staticPaths = ['./weather'];

let baseRouter = KoaRouter();
let apiRouter = KoaRouter();
let staticRouter = KoaRouter();

let aFs = {};
['stat', 'readFile', 'readdir'].map(funcName => aFs[funcName] = (...args) => {
	return new Promise((resolve, reject) => {
		if( args.length > 1 ) {
			args.pop();
		}
		args.push((err, data) => {
			if(err) {
				reject(err);
			}
			resolve(data);
		});
		fs[funcName].apply(this, args);
	});
});

async function traversalFile(targetPath) {
	let stats = await aFs.stat(targetPath);
	if( stats.isDirectory() ) {
		return (await Promise.all((await aFs.readdir(targetPath))
			.map( async name => {
				return await traversalFile( path.resolve( targetPath, name) )
			} )))
			.reduce( (acc, val) => acc.concat(val) , [] );

	} else if( stats.isFile() ) {
		return [path.relative( path.resolve('.'), targetPath)];
	}
}

async function start() {
	baseRouter.use('/weather', async (ctx, next) => {
		console.log(`[${new Date()}] Weater static Start: ${ctx.url}`);
		await next();
		console.log(`[${new Date()}] Weater static End: ${ctx.url}`);
	}).get('/weather/', async (ctx, next) => {
		ctx.type = '.html';
		ctx.body = await aFs.readFile('./weather/index.html');
	});
	(await Promise.all(staticPaths.map( traversalFile )))
		.reduce( (acc, val) => acc.concat(val) , [] )
		.map(filePath => {
			baseRouter.get('/' + filePath.split(path.sep).join('/'), async (ctx, next) => {
				ctx.type = path.extname(path.basename(filePath, '.gz'))
				ctx.body = await aFs.readFile(path.resolve('.', filePath));
			})
		});

	let weatherRouter = KoaRouter();
	weatherRouter.get('/:weather_id', async (ctx, next) => {
		console.log(`weather_id = ${ctx.params.weather_id}`);
		try {
	    	ctx.body = await aFs.readFile(`${__dirname}/mock-data/${ctx.params.weather_id}.json`);
		} catch(e) {
			ctx.body = e;
		}
	});

	apiRouter.use('/weather', weatherRouter.routes());

	baseRouter
		.use('/api', async (ctx, next) => {
			console.log(`[${new Date()}] Api Start: ${ctx.url}`);
			ctx.type = 'application/json';
			await next();
			console.log(`[${new Date()}] Api End: ${ctx.url}`);
		})
		.use('/api', apiRouter.routes());


	app.use(baseRouter.routes());
	app.listen(9999);

}
start();
