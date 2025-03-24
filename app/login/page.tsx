'use client'
import styles from './page.module.scss';
import {useState} from 'react'
import { useUserDispatchContext, useUserStateContext } from '@/context/userContext';
import CustomSpinner from '../components/loading/CustomSpinner/customSpinner';
import { useRouter } from 'next/navigation';

export default function Login(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('')
    const { login } = useUserDispatchContext();
    const { loading } = useUserStateContext();
    const router = useRouter();

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
        router.push(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={handleLogin}>
                    <h1>Login</h1>
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
                <div className={styles.registerDiv}>
                    <p>Don't have an account? <span className={styles.signUp} onClick={()=>router.push('/login/register')}>Sign up</span></p>
                    </div>
            </div>
        </div>
    )
}
