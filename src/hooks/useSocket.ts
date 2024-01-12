import { useEffect, useState } from "react";
import { socket } from "../socket/socket";



const useSocket = <T>(event: string) => {


    const [data, setData] = useState<T>()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {

        function onConnect() {
        setIsConnected(true);
        }

        function onDisconnect() {
        setIsConnected(false);
        localStorage.removeItem("gameId")
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        }; 

    }, [])

    useEffect(() => {

        function onEvent(value: T) {
            setData((prevData: T | undefined) => ({...value}));
        }


        socket.on(event, onEvent);
            

        return () => {
            socket.off(event, onEvent);
        }

    }, [event])

    return  { data, isConnected }

}


export default useSocket