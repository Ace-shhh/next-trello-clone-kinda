'use client'
import style from './page.module.scss';
import {useState} from 'react'
import { useUserContext } from '@/context/userContext';
import CustomSpinner from '../components/loading/CustomSpinner/customSpinner';

export default function Login(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('')
    const { login, loading } = useUserContext();


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
                    <button type='submit' disabled={loading}>
                        { loading ? <CustomSpinner size={20} color='white' borderWidth={2} marginTop={null}/> : ('Log in')}
                    </button>
                </form>

                <div>
                    <h3>Try it</h3>
                    <p>Email : test1@gmail.com</p>
                    <p>Password : test3333</p>
                    <p>or</p>
                    <p>Email : test4@gmail.com</p>
                    <p>Password : test4444</p>
                </div>
            </div>

        </div>
    )
}
