<script>
    import {joined_chats_rooms, matrix_url, selected_chat,matrix_server, matrix_token} from "./store.js";
   import {KcApi} from "./services/KcApi.js";


   export let chats = [
        {id:1, name:"Danila", avatar:'src/assets/svelte.png'},
        {id:2, name:"Igor", avatar:'src/assets/svelte.png'},
        {id:3, name:"Viktor", avatar:'src/assets/svelte.png'},
    ]

   export let joinEventsResult

   let searchName=''

   let finded_users =[]


   const debaunce = (func, delay)=>{
       let timeoutId

       return ()=>{
           if(timeoutId){
               clearTimeout(timeoutId)
           }
           timeoutId = setTimeout(()=>{
               func()
               timeoutId = null
           },delay)
       }
   }

   const getUsersList = async()=>{
       if(searchName){
           const res = await KcApi.getUserListByName(searchName)
           console.log(res)
           if(res && res.response && Array.isArray(res.response)){
               finded_users = res.response
           }
       }else{
           finded_users = []
       }
   }
   const getUsers = debaunce(getUsersList, 1000)

   $: {searchName, getUsers()}

   const findRoom = async  (user)=>{
       const{api_users_id, name} = user
       console.log(user)
       console.log(Object.entries(joinEventsResult))
       console.log(Object.values(joinEventsResult))
       console.log(Object.keys(joinEventsResult))
       console.log(joinEventsResult)
       const body ={
           invite: [`@${api_users_id}:${$matrix_server}`],
           is_direct: true,
           name: `Direct with ${name}`,
           topic: 'Is direct conversation between 2 users'
       }
       const rooms = await fetch(`${$matrix_url}/_matrix/client/v3/createRoom`,{
           method: 'POST',
           headers: {
               'authorization': `Bearer ${$matrix_token}`,
           },
           body:JSON.stringify(body)
       })
       // const rooms = await fetch(`${$matrix_url}/_matrix/client/v3/joined_rooms`,{
       //     headers: {
       //         'authorization': `Bearer ${$matrix_token}`,
       //     }
       // })
       // console.log(await rooms.json())
   }


</script>

<div class="container">
<!--    <ul>-->
<!--        {#each chats as user (user.id)}-->
<!--            <li on:click={console.log(user.id)}>-->
<!--                <img src={user.avatar} alt="avatar">-->
<!--                <span>{user.first_name,  user.last_name}</span>-->
<!--            </li>-->
<!--        {/each}-->
<!--    </ul>-->
    <div class="search_container">
        <input type="text" bind:value={searchName}>
        {#if finded_users?.length}
            <ul>
                {#each finded_users as user }
                    <li on:click={()=>findRoom(user)}>{user.username}</li>
                {/each}
            </ul>
        {/if}
    </div>

    {#if $joined_chats_rooms?.length}
        <ul>
            {#each $joined_chats_rooms as room}
                <li on:click={selected_chat.set(room)} class="chat_name">
<!--                    <img src= alt="avatar">-->
                    {#if joinEventsResult[room]?.['m.room.name']}
                        <span>{joinEventsResult[room]['m.room.name'][0]['content']['name']}</span>
                        <div>
                            {#each joinEventsResult[room]['m.room.member'] as member}
                                {#if member['content']['membership'] === 'join'}
                                    <span>{member['content']['displayname']} </span>
                                {/if}
                            {/each}
                            </div>
<!--                        <span>{room}</span>-->
                        <p>New messages {joinEventsResult[room]['new_messages']}</p>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}


</div>

<style>
    .container{
        width: 250px;
        height: 100vh;
        border: 1px solid gray;
        overflow: scroll;
        overflow-scrolling:auto ;
    }
    ul{
        padding: 0;
    }
    li{
        margin-top: 5px;
        display: flex;
        align-items: start;
        max-height: 80px;
        list-style: none;
    }
    li:hover{
        background: #f5f5f5;
        cursor: pointer;
    }
    img{
        max-width: 80px;
        height: 100%;
    }
    .chat_name{
        display: flex;
        flex-direction: column;
    }

</style>