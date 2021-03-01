const http = require('http')
const fs = require('fs').promises

const users = {};
const port = 3000;

http.createServer(async(req,res)=>{
    try{
        console.log(req.method , req.url);
        if(req.method ==='GET'){  // read
            if(req.url ==='/'){ // form 페이지
                const data = await fs.readFile("./restFront.html");
                res.writeHead(200,{'Content-Type':'text/html; charset-utf8'});
                return res.end(data);
            }else if(req.url ==='/about'){ // 소개페이지
                const data = await fs.readFile('./about.html');
                res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
                return res.end(data);
            }else if(req.url ==='/users'){ // 사용자 정보 
                res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
                return res.end(JSON.stringify(users));
            }

            
            try{    // front.js css
                const data = await fs.readFile(`.${req.url}`);
                return res.end(data);
            }catch(err){
                // 404 page not found;
            }
        }else if(req.method==='POST'){ //create
            if(req.url ==="/user"){ //user 생성
                let body='';

                req.on('data',(data)=>{ // 요청의 body 부분 stream 형식으로 받음. (생성할 데이터 정보 들어있음)
                    body+=data;
                });

                return req.on('end',()=>{ // body 다 받으면
                    console.log("POST body : ",body);
                    const { name }= JSON.parse(body);
                    const id = Date.now();
                    users[id] = name;
                    res.writeHead(201); //post 
                    res.end("Registered");
                })
            }
        }else if(req.method === 'PUT'){ // update
            if(req.url.startsWith('/user/')){
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data',(data)=>{
                    body+=data; // 데이터를 문자열로 받기
                });
                return req.on('end',()=>{
                    console.log("PUT body:",body);
                    users[key] = JSON.parse(body).name; // 문자열 => JSON객체로 만들고 => name 에 해당하는 값으로 수정
                    return res.end(JSON.stringify(users));
                })
            }
        }else if(req.method==='DELETE'){
            if(req.url.startsWith('/user/')){
                const key = req.url.split('/')[2];
                delete users[key];
                return res.end(JSON.stringify(users))
            }
        }

        res.writeHead(404);
        return res.end('NOT FOUND');
    }catch(err){
        console.error(err);
        res.writeHead(500,{'Content-Type':'text/html; charset=utf-8'});
        return res.end(err.message); 
    }
})
    .listen(port,()=>{
        console.log(`${port} port is listening...`);
    })