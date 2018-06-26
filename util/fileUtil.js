var fs = require('fs');
const inly = require('inly');
const uuid = require('uuid/v1');
const fileType = require('file-type');

let extractFile=(from, to)=>new Promise((resolve, reject)=>{
		const extract = inly(from, to)
		.on('file', (name) => {})
		.on('error', (error) => reject(error))
		.on('end', (file) => resolve());
	});
exports.extractFile=extractFile;

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
exports.extractAndObtainB64=extractAndObtainB64;

let findFilesBase64=folder=>new Promise((resolve, reject)=>{
	fs.readdir(folder, (err, files) => {
		filesb64=[];
		if(files!=undefined){
			  files.forEach(file => {
                const path=folder+file
				buffer=fs.readFileSync(path);
				const fileTypeFile= fileType(buffer);
				const prefix=fileTypeFile===null?'':`data:${fileTypeFile.mime};base64,`;						
				filesb64.push({ uuid:uuid() ,file:prefix+buffer.toString('base64'), filename: file});
				try { fs.unlink(path,()=>{}); } catch (error) {}
			  });
			}
			resolve(filesb64);
		});
	});	
exports.findFilesBase64=findFilesBase64;
