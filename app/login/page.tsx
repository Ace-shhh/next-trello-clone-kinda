'use client'
import style from './page.module.scss';
import {useState} from 'react'
import { useUserContext } from '@/context/userContext';
export default function Login(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('')
    const { login } = useUserContext();


    const handleLogin = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        login(email, password);
    }

    return (
        <div className={style.container}>
            <div className={style.formContainer}>
                <h1>Login</h1>
                <form className={style.form} onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type='text' value={email} required onChange={(e)=>setEmail(e.target.value)}/>
                    <label>Password</label>
                    <input type='password' value={password} required onChange={(e)=>setPassword(e.target.value)}/>
                    <button type='submit'>SUBMIT</button>
                </form>
            </div>

        </div>
    )
}