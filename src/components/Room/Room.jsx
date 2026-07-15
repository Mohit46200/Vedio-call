import { usePeer } from "../../providers/Peer"
import { useSocket } from "../../providers/Socket"
import { useCallback, useEffect } from "react"


const Room = () => {
    const socket = useSocket()
    const {peer,createOffer} = usePeer()


    const handleNewUserJoined = useCallback(async(data) => {
        const {email} = data
        console.log("New user Joined room ",email)
        const offer = await createOffer()
        socket.emit('call-user',{email,offer})

    },[createOffer,socket])

    const handleIncomingCall = useCallback((data) => {
        const {from ,offer} = data
        console.log("Incoming call from ",from, offer)
    },[])

    useEffect(() => {
        socket.on("user-joined",handleNewUserJoined)
        socket.on('incoming-call',handleIncomingCall)

        // return () => {
        //     socket.off("user-joined",handleNewUserJoined)
        //     socket.off("incoming-call",handleIncomingCall)

        // }

    },[socket,handleNewUserJoined,handleIncomingCall])

    return (
        <>
            <h1>This is room</h1>
        </>
    )

}


export default Room