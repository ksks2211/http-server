async function getUser(){  // get user
    try{
        const res = await axios.get('/users');
        const users = res.data;
        const list = document.getElementById('list');
        list.innerHTML = '';

        Object.keys(users).map(function(key){
            const span = document.createElement('span');
            span.textContent = users[key];


            //Edit button
            const edit = document.createElement('button');
            edit.textContent="Edit";
            edit.addEventListener('click',async()=>{
                const name = prompt("Changed Name ?");
                if(!name){
                    return alert("Changed Name Needed.");
                }
                try{
                    await axios.put('/user/'+ key,{name});
                    getUser();
                }catch(err){
                    console.error(err);
                }
            })

            //remove button
            const remove = document.createElement('button');
            remove.textContent = "Remove";
            remove.addEventListener('click',async()=>{
                try{
                    await axios.delete('/user/'+key);
                    getUser();
                }catch(err){
                    console.error(err);
                }
            })

            const userDiv = document.createElement('div');
            userDiv.appendChild(span);
            userDiv.appendChild(edit);
            userDiv.appendChild(remove);

            list.appendChild(userDiv);

            //console.log(res.data[key]);
        })
    }catch(err){
        console.error(err);
    }
}


//화면 로딩 시 호출
window.onload = getUser;


//폼 제출시 실행될 이벤트
document.getElementById('form').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const name = e.target.username.value;
    if(!name){
        return alert("Name Needed!");
    }
    try{
        await axios.post('/user',{name});
        getUser();
    }catch(err){
        console.error(err);
    }

    //clear form
    e.target.username.value="";
})