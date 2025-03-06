import styles from './editProfile.module.scss';
import { useUserContext } from '@/context/userContext';
import ProfilePicture from '../../user/profilePicture/profilePicture';
import { useRef, useState, useEffect } from 'react';
import { updateUser } from '@/services/userService';
import { toast } from 'react-toastify';
import { CustomError } from '@/app/lib/definitions';
export default function EditProfile(){
    const { userInfo, setUserInfo } = useUserContext();
    const [username, setUsername] = useState<string>(userInfo?.username || '');
    const [email, setEmail] = useState<string>(userInfo?.email || '');
    const [password, setPassword] = useState<string>('')
    const [preview, setPreview] = useState<string>(userInfo?.profilePicture || '');

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(()=>{

        if(userInfo){
            setUsername(userInfo.username);
            setEmail(userInfo.email);
            setPreview(userInfo.profilePicture);
        }

    },[userInfo]);

    if(!userInfo){
        return <div>Loading...</div>
    }

    function handleFileClick(){
        fileInputRef.current?.click();
    };

    function handleFileChange(e : React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        if(file){
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        };
    };


    async function handleSubmit(e : React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        if(!userInfo) return;

        const formData = new FormData();
        const usernameTrim = username.trim();
        const emailTrim = email.trim();

        if(usernameTrim !== userInfo.username){
            formData.append('username', usernameTrim);
        }

        if(emailTrim !== userInfo.email){
            formData.append('email', emailTrim);
        }

        const file = fileInputRef.current?.files?.[0];

        if(file){
            formData.append('profilePicture', file);
        };

        formData.append('password', password);

        try{
            const updatedUser = await updateUser(userInfo._id, formData);
            setUserInfo(updatedUser);
        }
        catch(error : unknown){
            if(error instanceof CustomError){
                toast.error(error.message);
            }else{
                toast.error(String(error));
            };
        };
    };

    return(
        <div className={styles.container}>
                <div className={styles.profilePictureContainer}>
                    <span><ProfilePicture customProfilePicture={preview} customUserName={userInfo.username} hoverEffect={false} size={200}/></span>
                    <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{display: 'none'}}/>
                    <button onClick={handleFileClick}>Choose File</button>
                </div>
            <form onSubmit={handleSubmit} className={styles.editForm}>
                
                <label htmlFor="username">Username</label>
                <input type='text' placeholder={username} onChange={(e)=> setUsername(e.target.value)}/>

                <label htmlFor="email">Email</label>
                <input type='text' placeholder={email} onChange={(e)=> setEmail(e.target.value)}/>
                
                <label>Password</label>
                <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required={true}/>
                <button type='submit' className={styles.saveButton}>SAVE</button>
            </form>
            
        </div>
    )
}