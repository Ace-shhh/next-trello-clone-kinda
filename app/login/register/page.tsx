'use client'
import styles from './page.module.scss'
import { useState } from 'react'
import { CustomError } from '@/app/lib/definitions'
import { toast } from 'react-toastify'
import { createUser } from '@/services/userService'
import { useUserContext } from '@/context/userContext';

export default function Register(){
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [showMatchError, setShowMatchError] = useState<boolean>(false);
    const { login } = useUserContext();

    async function handleSubmit(e : React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        const usernameTrim = username.trim();
        const emailTrim = email.trim();
        const passwordTrim = password.trim();

        
        if(!usernameTrim || !emailTrim || !passwordTrim){
            toast.error('Please fill all the fields')
            return
        }

        if(password !== confirm){
            setShowMatchError(true);
            return;
        };
    
        try{
            const newUser = await createUser({username : usernameTrim, email : emailTrim, password : password});
            login(newUser.email, password);
        }
        catch(error){
            if(error instanceof CustomError){
                toast.error(error.message)
            }else{
                toast.error(String(error));
            };
        };
    };

    return(
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1>Sign up</h1>
                <label htmlFor='username'>
                    Username
                    <input 
                        type='text' 
                        value={username} 
                        onChange={(e)=>setUsername(e.target.value)}
                        required={true}
                    />
                </label>
                <label htmlFor='email'>
                    Email
                    <input 
                        type='text' 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)}
                        required={true}
                    />
                </label>
                <label htmlFor='password'>
                    Password
                    <input 
                        type='password' 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)}
                        required={true}
                    />
                </label>
                <label htmlFor='Confirm password'>
                    Confirm password
                    <input 
                        type='password' 
                        value={confirm} 
                        onChange={(e)=>setConfirm(e.target.value)}
                        required={true}
                    />
                </label>
                { showMatchError && <span className={styles.match}>Password does not match</span>}
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}