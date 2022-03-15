<script>
  import logo from './assets/svelte.png'
  import Counter from './lib/Counter.svelte'
  import Chats from "./Chats.svelte";
  import Messages from "./Messages.svelte";
  import {
    chats,
    kc_token,
    matrix_url,
    matrix_token,
    matrix_since,
    api_user_guid,
    joined_chats_rooms,
    matrix_server, matrix_user_guid,
    account_guid
  } from "./store.js";
  import {onMount} from 'svelte'
  import {KcApi} from "./services/KcApi.js";
  import {Matrix} from "./services/Matrix.js";
  import Messenger from "./lib/components/custom/messenger/Messenger.svelte";

  // let chats;

  kc_token.set('49335b73af4b5c46a863bd44a2c20925')

  let kcToken = '49335b73af4b5c46a863bd44a2c20925';

  let apiUrl = import.meta.env.VITE_API_URL
  let apiVersion = import.meta.env.VITE_API_VERSION

  let matrix_Url = null;
  let matrix_home_server = null;
  let matrix_user_token = null;
  let kc_user_guid = null;
  const joinEventsResult = {}

  let joined_room = []

  let active = false


  export let props_token_kc = ''

  $: {props_token_kc; kc_token.set(props_token_kc)}
  $: {$kc_token; setupMessenger()}
  $: {$matrix_token; subscribe()}

  const setupMessenger = async () => {

    if(!props_token_kc && $matrix_token){
       await Matrix.cancel()
       await Matrix.logout()
       matrix_token.set('')

      return
    }

    if(props_token_kc){
      authToMatrix()
      let config_response = await KcApi.getMatrixConfig()
      if(config_response.code === 200){
        matrix_url.set(config_response.response?.url)
        matrix_server.set(config_response.response?.homeserver)
      }
    }

  }

  const authToMatrix = async() => {

    let get_matrix_token_response = await KcApi.getMatrixToken()
    console.log(get_matrix_token_response);

    if(get_matrix_token_response &&
        (get_matrix_token_response.code === 200) &&
         get_matrix_token_response.response.matrix_token
      ){
      api_user_guid.set(get_matrix_token_response.response.api_user_guid)
      matrix_user_guid.set(get_matrix_token_response.response.matrix_user_id)
      matrix_token.set(get_matrix_token_response.response.matrix_token)
      account_guid.set(get_matrix_token_response.response.account_guid)
    }else{
      api_user_guid.set('')
      matrix_user_guid.set('')
      matrix_token.set('')
    }
  }




  // onMount( async ()=>{
  //   let res = await KcApi.getMatrixConfig()
  //   // res.response
  //   // res?.response?.url &&
  //   await matrix_url.set(res.response.url)
  //
  //   let tokenM = await KcApi.getMatrixToken()
  //   // console.log('Matrix Token',tokenM);
  //
  //   // if(!!tokenM.response.matrix_token){
  //   // }
  //
  //   await matrix_token.set(tokenM.response.matrix_token)
  //   // await matrix_token.set('syt_MTc3YWFlNzAtOThhMC01N2E0LTkyZjAtMzk0ZTRiMmVlZWZl_BCHoWwlqIRZJcImsyOKW_4WPEir')
  //
  //   await api_user_guid.set(tokenM.response.api_user_guid)
  //   // await api_user_guid.set('177aae70-98a0-57a4-92f0-394e4b2eeefe')
  //   if(tokenM.response.matrix_token){
  //     subscribe()
  //     checkRoomsEvents(sync.rooms)
  //     let rooms = await Matrix.joined_rooms()
  //     joined_chats_rooms.set(rooms['joined_rooms'])
  //     console.log('Matrix.joined_rooms',rooms);
  //
  //     let room_messages = await Matrix.room_messages(rooms['joined_rooms'][1])
  //     console.log(`room_messages ${rooms['joined_rooms'][1]}`,room_messages);
  //   }
  //   // let sync = await Matrix.sync()
  //   // sync.next_batch && matrix_since.set(sync.next_batch)
  //   // console.log('response by syncRequest',sync );
  //   // checkRoomsEvents(sync.rooms)
  //
  //
  //
  //
  // })

  const subscribe = async()=>{
    if(!$matrix_token){
      return
    }
    try {
      let sync = await Matrix.sync()
      console.log('sync',sync);
      sync.next_batch && matrix_since.set(sync.next_batch)
      if(sync["errcode"] === undefined){
        console.log('response by syncRequest',sync );
        checkRoomsEvents(sync.rooms)
        let rooms = await Matrix.joined_rooms()
        console.log(rooms);
        joined_chats_rooms.set(rooms['joined_rooms'])
        // if(!checkArrayISIdentical(rooms['joined_rooms'], $joined_chats_rooms)){
        // }
        authToMatrix()
      }
    }catch(e){
      authToMatrix()
    }

  }

  const checkArrayISIdentical =(a,b)=>{
    if(a && a.length){
      for (let i = 0; i < a.length; i++) {
        if(a[i] !== b[i]){
          return false
        }
      }
    }
    return true
  }

  const checkRoomsEvents = (rooms) =>{

    console.log("All rooms from sync",rooms);

    const ephemeralEventsResult = {}

    if(rooms && rooms.invite){
      for (let room_id in rooms.invite){

        let room = rooms.invite[room_id]

        const joined_room =  Matrix.join_room(room_id)
        joined_room.then(data=>console.log(`joined_room ${room_id}`,data))
      }

    }

    if(rooms && rooms.join){
      for ( let room_id in rooms.join){

        let room_members = Matrix.room_members(room_id)
        room_members.then(data=> {
          console.log(`roomMemberrs ${room_id}`, data)
          joinEventsResult[room_id]['m.room.member'] = [...data?.chunk]

          joinEventsResult[room_id]['m.room.member'].forEach((member)=>{
            Matrix.user_presence(member.user_id).then((data)=>console.log('userdata', data))
          })


        })


        if(!joinEventsResult.hasOwnProperty(room_id)){
          joinEventsResult[room_id] = {}
        }

        let room = rooms.join[room_id]

        room.state?.events?.forEach((event)=>{
          if(!joinEventsResult[room_id].hasOwnProperty(event.type)){
            joinEventsResult[room_id][event.type] = [event]
          }else{
            joinEventsResult[room_id][event.type].push(event)
          }

          // if(event.type === 'm.room.member') {
          //   console.log(room_id, event.type, event.state_key)
          //   if (!joinEventsResult[room_id].hasOwnProperty('members')) {
          //     joinEventsResult[room_id].members = [event.state_key]
          //   } else {
          //     if (!joinEventsResult[room_id].members.includes(event.state_key)) {
          //       joinEventsResult[room_id].members.push(event.state_key)
          //     }
          //   }
          // }
        })

        room.timeline?.events?.forEach((event)=> {
          if (!joinEventsResult[room_id].hasOwnProperty(event.type)) {
            joinEventsResult[room_id][event.type] = [event]
          } else {
            joinEventsResult[room_id][event.type].push(event)
          }
          // if (event.type === 'm.room.member') {
          //   if (!joinEventsResult[room_id].hasOwnProperty('members')) {
          //     joinEventsResult[room_id].members = [event.state_key]
          //   }
          //  else {
          //   if (!joinEventsResult[room_id].members.includes(event.state_key)) {
          //     joinEventsResult[room_id].members.push[event.state_key]
          //     }
          //   }
          // }
        })

        room.ephemeral?.events?.forEach(()=>{
          // ephermal events handler eg - typing....
        })

        joinEventsResult[room_id]['new_messages'] = room?.['unread_notifications']?.['notification_count'] ?? 0


      }
    }

      console.log('All rooms and events object', joinEventsResult);

  }



  // const users
</script>

<main>
  <button on:click={()=>{active = !active}}>open MEs</button>
  <span>User Kc token </span><input type="text" bind:value={props_token_kc}>
  <div class="messanger">
    <Chats joinEventsResult={joinEventsResult}/>
    <Messages joinEventsResult={joinEventsResult}/>
  </div>


  <Messenger is_active={active}
             chatRoomsData={joinEventsResult}/>
<!--  <Inputs/>-->


</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  .messanger{
    display: flex;
    flex-direction: row;
  }
  input{
    width: 250px;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
