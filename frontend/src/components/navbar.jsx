import logo from '../imgs/mylogo.png';
import { Link, Outlet } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from '../App.jsx';
import UserNavigation from './user-navigation.jsx';

const Navbar = () => {

    const { userAuth, userAuth: { accessToken, profile_img } } = useContext(UserContext);

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

    const [userNavPanel, setUserNavPanel] = useState(false);

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        });
    }

    return (
        <>
            <nav className='navbar'>
                {/* Logo */}
                <Link to="/" className='flex-node w-20'>                                        
                    <img src={logo} className=' mylogo w-full rounded-[20px]' alt="logo" />
                </Link>
                {/* Search Bar*/}
                <div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + (searchBoxVisibility ? 'show' : 'hide')}>
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md-pr-6 rounded-full placeholder:text-dark-grey md:pl-16'
                    />
                    <i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl"></i>
                </div>
                <div className="flex items-center gap-3 md:gap-6 ml-auto">

                    {/* This button will affect the visibility of the search bar */}
                    <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
                        onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}>
                        <i className="fi fi-br-search text-xl"></i>
                    </button>

                    {/* Navbar Link to take to editor page*/}
                    <Link to="/editor" className='hidden md:flex gap-2 link'>
                        <i class="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    {
                        accessToken ?
                            <>
                                {/* Navbar Link to take to profile page*/}
                                <Link to="/dashboard/notifications" className='hidden md:flex gap-2 link'>
                                    <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                        <i className="fi fi-bs-bell text-2xl block mt-1"></i>
                                    </button>
                                </Link>

                                <div className='relative' onClick = {handleUserNavPanel} onBlur={handleBlur}>
                                    <button className='w-12 h-12 mt-1'>
                                        <img src={profile_img} className='w-full h-full object-cover rounded-full' />
                                    </button>
                                    {
                                        userNavPanel ? <UserNavigation /> : ""
                                    }
                                </div>
                            </>
                            :
                            <> {/* Navbar Link to take to login/sign in page*/}
                                <Link to="/signin" className='btn-dark'>
                                    Sign in
                                </Link>

                                {/* Navbar Link to take to login/sign in page*/}
                                <Link to="/signup" className='btn-light py-2 hidden md:block'>
                                    Sign up
                                </Link>
                            </>
                    }


                </div>

            </nav>

            {/* Outlet is used to render the child components of the parent component */}
            <Outlet />
        </>

    )
}

export default Navbar;