<script>
    import ChatItem from "./ChatItem.svelte";
    import {Matrix} from "../../../../services/Matrix.js";
    import cloneDeep from 'lodash.clonedeep'

    import * as dayjs from 'dayjs'

    //props
    export let chatRoomsData

    //store
    import {matrix_user_guid, selected_chat} from "/src/store.js";

    // $:{$selected_chat; calculateChatRooms()};
    $:{chatRoomsData; calculateChatRooms()}

    let chatRooms = {}

    const calculateChatRooms =()=>{
        let result = {}
        console.log('calculateChatRooms',chatRoomsData)

        const copyChats = cloneDeep(chatRoomsData)

        for(let room in copyChats){
            const chatRoom = copyChats[room]

            if(!result.hasOwnProperty(room)){
                result[room] = {}
            }

            result[room]['members'] = chatRoom['m.room.member'].filter(el => el.state_key !== $matrix_user_guid)
            // Matrix.get_user_profile(result[room]?.members[0]?.state_key).then((data)=>console.log('userProfile', result[room]?.members[0]?.state_key,data))
            result[room]['name'] =  chatRoom['m.room.name'][0]
            result[room]['message'] =  chatRoom['m.room.message']
            result[room]['message'] =  [...result[room]['message']].reverse()[0] || {}
            result[room]['message']['date'] = dayjs(result[room]['message']?.origin_server_ts).format('DD/MM/YY HH:mm')
            result[room]['message']['date_days'] = dayjs(result[room]['message']?.origin_server_ts).format('DD/MM/YY')
            result[room]['message']['date_time'] = dayjs(result[room]['message']?.origin_server_ts).format('HH:mm')
            result[room]['timestamp'] = result[room]['message']?.origin_server_ts
            result[room]['new_messages'] = chatRoom['new_messages']

        }
        const sortedRooms = Object.keys(result).sort((a,b)=> result[b].timestamp - result[a].timestamp)
        const sortedObjectChats ={}
        for(let room of sortedRooms){
            sortedObjectChats[room] = result[room]
        }

        chatRooms = sortedObjectChats

        console.log(chatRooms)
    }




</script>

<div class="kc-messenger__contacts">
    {#if Object.keys(chatRoomsData).length > 0}

        {#each Object.keys(chatRooms) as room }
            <ChatItem
                    img={'/images/dev/userpic-kc.png'}
                    is_active={room === $selected_chat}
                    name={chatRooms[room]?.['name'].content.name}
                    msg={chatRooms[room]?.['message']?.content.body}
                    time={`${chatRooms[room]?.['message']?.['date_days']} - ${chatRooms[room]?.['message']?.['date_time']}`}
                    msg_count={chatRooms[room]?.new_messages}
                    on:click={selected_chat.set(room)}
            />
        {/each}

    {/if}

    <!--            <ChatItem-->
    <!--                    img={'/images/dev/userpic-james.png'}-->
    <!--                    is_active={false}-->
    <!--                    name={'James Morris'}-->
    <!--                    msg={'You’ve beeh granted the access to the course ADA Compliance: Providing Reason...'}-->
    <!--                    time={'12:00'}-->
    <!--                    msg_count={4}-->
    <!--                    on:click={() => { showChat = true }}-->
    <!--            />-->

</div>

