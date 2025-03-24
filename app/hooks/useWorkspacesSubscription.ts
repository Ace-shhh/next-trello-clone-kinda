import { useUserStateContext } from "@/context/userContext";
import { useWebsocketContext } from "@/context/websocketContext";
import { useEffect } from "react";
export default function useWorkspacesSubscription(WorkspaceHandler : (event : any)=> void){
    const { userInfo } = useUserStateContext();
    const { pusher, socketId } = useWebsocketContext();

    useEffect(()=>{
        if(!userInfo || !pusher || !socketId) return;

        console.log('Workspace live updated subscribed')

        const safePusher = pusher as NonNullable<typeof pusher>;

        const ownWorkspacesIds = userInfo.ownWorkspaces.map(ws=> ws._id);
        const otherWorkspacesIds = userInfo.otherWorkspaces.map(ws=> ws._id);

        const channels : any[] = [];

        function subscribeToWorkspaceIds(ids : string[]){
            ids.forEach(id=>{
                const channel = safePusher.subscribe(id);
                channel.bind('WorkspaceEvent', WorkspaceHandler);
                channels.push(channel);
            });
        };

        subscribeToWorkspaceIds(ownWorkspacesIds);
        subscribeToWorkspaceIds(otherWorkspacesIds);

        return ()=>{
            
            console.log('Workspace event cleaning up')

            channels.forEach(channel=>{
                channel.unbind('WorkspaceEvent', WorkspaceHandler);
                safePusher.unsubscribe(channel.name);
            });
        };
    },[userInfo, pusher, socketId, WorkspaceHandler]);
}