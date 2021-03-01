async function getUser(){  // get user
    try{
        const res = await axios.get('/users');
        const users = res.data;
        const list = document.getElementById('table-list');
        list.innerHTML = '';

        Object.keys(users).map(function(key){
            const tr = document.createElement('tr');
            
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            td1.textContent = users[key];

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

            td2.appendChild(edit);
            td3.appendChild(remove);

            list.appendChild(tr);

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