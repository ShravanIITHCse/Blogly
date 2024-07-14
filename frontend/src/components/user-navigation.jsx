import { delay } from "framer-motion";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useContext } from "react";
import { removeFromSession } from "../common/session";


const UserNavigation = () => {

    const { userAuth, setUserAuth } = useContext(UserContext);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ accessToken: null});
    }

    return (
        <AnimationWrapper
            className="absolute right-0 z-50"
            transition={{ duration: 0.2 }}
        >
            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                    <i class="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                <Link to={`/user/${userAuth.username}`} className="flex gap-2 link pl-8 py-4">
                    <i class="fi fi-rr-user"></i>
                    <p>Profile</p>
                </Link>
                <Link to="/dashboard/blogs" className="flex gap-2 link pl-8 py-4">
                    <i class="fi fi-rr-edit"></i>
                    <p>Dashboard</p>
                </Link>
                {/* settings */}
                <Link to="/settings/edit-profile" className="flex gap-2 link pl-8 py-4">
                    <i class="fi fi-rr-settings"></i>
                    <p>Settings</p>
                </Link>

                <span className="absolute border-t border-grey w-[100%]">
                    <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
                        onClick={signOutUser}
                    >
                        <h1 className="font-bold text-xl mg-1"> Sign out </h1>
                        <p className="text-dark-grey"> @{userAuth.username} </p>
                    </button>
                </span>
            </div>
        </AnimationWrapper>
    )
}

export default UserNavigation;