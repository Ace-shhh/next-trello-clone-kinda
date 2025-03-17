import { CustomError, IWorkspace, User } from '@/app/lib/definitions';
import styles from './addMember.module.scss';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { fetchUsers } from '@/services/userService';
import { toast } from 'react-toastify';
import UserTemplate from './userTemplate/userTemplate';
import { addWorkspaceMembers } from '@/services/workspaceService';
import { useUserContext } from '@/context/userContext';
import { GoPeople } from "react-icons/go";

export default function AddMember({workspaceData} : {workspaceData : IWorkspace}){
    const [addMember, setAddMember] = useState<boolean>(false);
    const [usersList, setUsersList] = useState<User[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [membersToAdd, setMembersToAdd] = useState<string[]>([]);

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const addMemberRef = useRef<HTMLDivElement | null>(null);
    const membersListRef = useRef<HTMLDivElement | null>(null);

    const { userInfo, setUserInfo } = useUserContext();

    if(!userInfo) return <div>Loading...</div>


    useEffect(()=>{
        function handleClickOutside(event : MouseEvent){
            if(membersListRef.current && !membersListRef.current.contains(event.target as Node)){
                setAddMember(false);
                setMembersToAdd([]);
            };
        };

        document.addEventListener('mousedown', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside)
        }
    },[])


    useEffect(()=>{
        if(!addMember) return;

        if(buttonRef.current && membersListRef.current){
            const rect = buttonRef.current.getBoundingClientRect();
            const listWidth= 300;
            const screenWidth = window.innerWidth;

            let leftPosition = rect.left;
            let rightOverFlow = rect.left + listWidth > screenWidth;

            if(rightOverFlow){
                leftPosition = rect.right - listWidth;
            };
            
            membersListRef.current.style.position = 'absolute';
            membersListRef.current.style.top = `${rect.bottom + 10}px`;
            membersListRef.current.style.left = `${leftPosition}px`;
        }
    },[addMember]);


    useEffect(()=>{
        if(!addMember) return;

        async function fetch(){
            try{
                setLoading(true);
                const users = await fetchUsers();
                if(users){
                    setUsersList(users);
                };
            }
            catch(error : unknown){
                if(error instanceof CustomError){
                    toast.error(error.message)
                }
                else{
                    toast.error(String(error))
                }
            }
            finally{
                setLoading(false);
            };
        };

        fetch();
    },[addMember]);

    const existingMembers = userInfo.ownWorkspaces.find(ws=> ws._id === workspaceData._id)?.members.map(user=> user.userId) ?? [];

    const filteredUsers = usersList?.filter((user)=>{
        const matchesSearch  = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const notMember = existingMembers.includes(user._id);
        const notSelf = (user._id !== userInfo._id);
        return matchesSearch && notMember && notSelf;
    });

    function handleChange(e : React.ChangeEvent<HTMLInputElement>, userId : string){
        if(e.target.checked){
            setMembersToAdd(prev=> [...prev, userId])
        }else{
            setMembersToAdd(prev=> prev.filter(id=> id !== userId));
        }
    }

    async function handleSave(){
        try{
            const updatedMembers = await addWorkspaceMembers(workspaceData._id, membersToAdd);
            setUserInfo(prev=>{
                if(!prev) return prev;
                const updatedWorkspaces = prev.ownWorkspaces.map(ws=>{
                    if(ws._id === workspaceData._id){
                        return {...ws, members : updatedMembers};
                    };
                    return ws;
                })
                return {...prev, ownWorkspaces : updatedWorkspaces}
            })


        }
        catch(error : unknown){
            if(error instanceof CustomError){
                toast.error(error.message);
            }else{
                toast.error(String(error))
            }
        }
    }


    return(
        <div className={styles.container} ref={addMemberRef}>
            <button className={styles.addMemberButton} onClick={()=>setAddMember(!addMember)} ref={buttonRef}>
                <GoPeople size={20}/> Add Members
            </button>
            {
                addMember && createPortal(
                    <div className={styles.membersList} ref={membersListRef}>
                        <input className={styles.userInput} value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>

                        <div className={styles.resultContainer}>
                            {loading && <div>Loading...</div>}

                            {!loading && filteredUsers?.map(user=>
                                <UserTemplate 
                                    key={user._id} 
                                    username={user.username} 
                                    profilePicture={user.profilePicture} 
                                    id={user._id} 
                                    setChange={handleChange}
                                    isChecked={membersToAdd.includes(user._id)}
                                />
                            )}

                            <button className={styles.saveButton} onClick={handleSave}>SAVE</button>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    )
}