const fs= require('fs');
const {google} = require('googleapis');

const apikeys=require('./apikey.json');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');

const SCOPE =['https://www.googleapis.com/auth/drive'];

async function authorize(){
    const jwtClient=new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    )

    await jwtClient.authorize();
    return jwtClient;
}

async function uploadFile(authClient){
    return new Promise((resolve,reject)=>{
        const drive=google.drive({version:'v3',auth:authClient})
        var fileMetadata={
            name:'test.txt',
            parents:["1XuKTgJ9vO2dw841tlLZ9JKfHyerwifdx" ]
        }
        drive.files.create({
            resource:fileMetadata,
            media:{
                body:fs.createReadStream('test.txt') ,
                mimeType:'text/plain'   
            },
            fields:'id'
        },function(err,file){
            if(err){
                return reject(err)
            }else{
                resolve(file)
            }
        })
    })
}

authorize().then(uploadFile).catch(console.error)