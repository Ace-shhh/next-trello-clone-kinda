'use client'
import { useEffect, useState } from 'react';
import Overlay from '@/app/components/overlay/Overlay';
import CustomSpinner from '@/app/components/loading/CustomSpinner/customSpinner';
import { useUserDispatchContext } from '@/context/userContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function GoogleLogin(){
    const [middle, setMiddle] = useState<number | null>(null)
    const { setUserInfo } = useUserDispatchContext();
    const router = useRouter();

    useEffect(()=>{
        setMiddle(window.innerHeight / 2);
        async function login(){
            const response = await fetch('/api/user/google',{
                credentials : 'include'
            });

            const json = await response.json();

            if(!response.ok){
                toast.error(json.message)
                setTimeout(()=>{
                    router.push('/login');
                }, 3000)
            };

            localStorage.setItem('userInfo', json.data);
            setUserInfo(json.data);
            router.push('/workspaces');
        };

        login();
    },[])
    
    return(
        <Overlay onClick={()=>{}}>
            <CustomSpinner size={60} color={'black'} borderWidth={5} marginTop={middle}/>
        </Overlay>
    )
}