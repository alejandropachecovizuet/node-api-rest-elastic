var fs = require('fs');
const inly = require('inly');
const uuid = require('uuid/v1');

let extractFile=(from, to)=>new Promise((resolve, reject)=>{
		const extract = inly(from, to)
		.on('file', (name) => {})
		.on('error', (error) => reject(error))
		.on('end', (file) => resolve());
	});

let extractAndObtainB64=(from)=>{
	const to=`/tmp/${uuid()}/`;
	if (!fs.existsSync(to)){
		fs.mkdirSync(to);
	}
	return new Promise((resolve, reject)=>
		extractFile(from, to).then(()=>
			findFilesBase64(to).then(list=>{
				try { fs.rmdir(to,()=>{}); } catch (error) {}
				resolve(list);				
				})
			, error=>{
				try { fs.rmdir(to,()=>{}); } catch (error) {}				
				reject(error)}
		));
	};

let findFilesBase64=folder=>new Promise((resolve, reject)=>{
	fs.readdir(folder, (err, files) => {
		filesb64=[];
		if(files!=undefined){
			  files.forEach(file => {
				const path=folder+file
				filesb64.push(fs.readFileSync(path).toString('base64'));
				try { fs.unlink(path,()=>{}); } catch (error) {}
			  });
			}
			resolve(filesb64);
		});
	});	
	
const from = '/home/apacheco/Alex2018/workspaceGit/personal/node-api-rest-elastic/extras/files_test/';
extractAndObtainB64('/home/apacheco/Alex2018/workspaceGit/personal/node-api-rest-elastic/extras/files_test/all.zip').then(b64s=>console.log('OK-zip',b64s.length),error=>console.error(error));	
/*extractAndObtainB64(from+'.gz').then(b64s=>console.log('OK-gz',b64s.length),error=>console.error(error));	
extractAndObtainB64(from+'.bz2').then(b64s=>console.log('OK-bz2',b64s.length),error=>console.error(error));	
extractAndObtainB64(from+'.tar').then(b64s=>console.log('OK-tar',b64s.length),error=>console.error(error));	
extractAndObtainB64(from+'.tar.gz').then(b64s=>console.log('OK-tar.gz',b64s.length),error=>console.error(error));	
extractAndObtainB64(from+'.tgz').then(b64s=>console.log('OK-tgz',b64s.length),error=>console.error(error));
extractAndObtainB64(from+'.tar.bz2').then(b64s=>console.log('OK-tar.bz2',b64s.length),error=>console.error(error));	
extractAndObtainB64(from+'.tar.bz2x').then(b64s=>console.log('OK-tar.bzx',b64s.length),error=>console.error("ERR-tar.bzx",error));	
*/


//findFilesBase64('/home/apacheco/Pictures/xxx/5a048399-3076b19a-dada-6349f81c1f13/');
