'use client'
import styles from './page.module.scss';
import {useState} from 'react'
import { useUserContext } from '@/context/userContext';
import CustomSpinner from '../components/loading/CustomSpinner/customSpinner';

export default function Login(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('')
    const { login, loading } = useUserContext();


    function handleLogin (e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        login(email, password);
    };

    const authUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_VERCEL_URL as string : process.env.NEXT_PUBLIC_AUTH_URL as string;

    async function handleGoogleLogin(){
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = `${authUrl}/api/oauth2callback`;
        const responseType = 'code';
        const scope = encodeURIComponent('openid email profile')
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1>Login</h1>
                <form className={styles.form} onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type='text' value={email} required onChange={(e)=>setEmail(e.target.value)}/>
                    <label>Password</label>
                    <input type='password' value={password} required onChange={(e)=>setPassword(e.target.value)}/>
                    <button type='submit' disabled={loading}>
                        { loading ? <CustomSpinner size={20} color='white' borderWidth={2} marginTop={null}/> : ('Log in')}
                    </button>
                    <span className={styles.divider}>or</span>
                    <img src='/web_light_sq_ctn.svg' onClick={handleGoogleLogin} className={styles.googleIcon}/>
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
