import { Link, Navigate } from 'react-router-dom';
import InputBox from '../components/inputBox.component.jsx';
import googleIcon from '../imgs/google.png';
import AnimationWrapper from '../common/page-animation.jsx';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session.jsx';
import { useContext } from 'react';
import { UserContext } from '../App.jsx';
import { authWithGoogle } from '../common/firebase.jsx';

const UserAuthForm = ({ type }) => {

    let { userAuth : {accessToken}, setUserAuth} = useContext(UserContext);
    
    console.log(accessToken);

    const userAuthThroughServer = (serverRoute, data) => { 
        

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute , data)
        .then(({data}) => {
            storeInSession("user", JSON.stringify(data));
            console.log(data);
            setUserAuth(data);
        })
        .catch(({response}) => {
            // how to catch invalid correct email but invalid password error
            toast.error(response.data.error);
        })
    }

    const submitHandler = (e) => {
        
        const serverRoute = type === 'sign-in' ? '/signin' : '/signup';

        e.preventDefault();
        const form = e.target.form;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        let [fullname, email, password] = [data.fullname, data.email, data.password];

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be at least 3 characters long")
            }
        }

        if (!email.length) {
            return toast.error("Email is required")
        }
        if (emailRegex.test(email) === false) {
            return toast.error("Email is invalid")
        }

        if (!password.length) {
            return toast.error("Password is required")
        }
        if (passwordRegex.test(password) === false) {
            return toast.error("Password must be 6-20 characters long, and contain at least one number and one uppercase letter")
        }

        userAuthThroughServer(serverRoute, data);

    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle().then((user) => {
            let serverRoute = "/google-auth";

            let data = {
                accessToken : user.accessToken,
            }

            userAuthThroughServer(serverRoute, data);
        })
        .catch((error) => {
            toast.error("Trouble signing in with Google");
            console.log(error);
        })
        
    }
    return (
        accessToken ? <Navigate to="/" /> : 
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form className="w-[80%] max-w-[400px]">
                    <h1 className="text-center text-4xl mb-24 font-gelasio">
                        {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
                    </h1>

                    {
                        type === 'sign-up' ?
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder={"Full Name"}
                                icon="fi fi-br-user"
                            />
                            : ""
                    }
                    {/* Input box for email */}
                    <InputBox
                        name="email"
                        type="email"
                        placeholder={"Email"}
                        icon="fi fi-br-envelope"
                    />
                    {/* Input box for password */}
                    <InputBox
                        name="password"
                        type="password"
                        placeholder={"Password"}
                        icon="fi fi-br-lock"
                    />

                    {/* Sign up button */}
                    <button
                        className="btn-dark center mt-14"
                        type='submit'
                        onClick={submitHandler}>
                        {type === 'sign-in' ? 'Sign in' : 'Sign up'}
                    </button>

                    <div className='relative w-full flex items-center gaps-2 my-10 opacity-25 uppercase text-black font-bold'>
                        <hr className='w-1/2 border-black' />
                        OR
                        <hr className='w-1/2 border-black' />
                    </div>

                    {/* Sign up with Google button */}
                    <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
                        onClick={handleGoogleAuth}
                    >
                        <img src={googleIcon} alt="google" className='w-6 h-6 mr-2' />
                        Continue with Google
                    </button>

                    {
                        type == "sign-in" ?
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Don't have an account?
                                <Link to="/signup" className='text-black underline ml-1 text-xl'>Sign up here</Link>

                            </p>
                            :
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Already have an account?
                                <Link to="/signin" className='text-black underline ml-1 text-xl'>Sign in here</Link>
                            </p>

                    }
                </form>
            </section>
        </AnimationWrapper> 

    )
}

export default UserAuthForm;