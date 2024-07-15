import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm";
import { createContext, useEffect, useState } from "react";
import { getFromSession } from "./common/session";
import Editor from "./pages/editor";


export const UserContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userinSession = getFromSession("user");
        if(userinSession) {
            setUserAuth(JSON.parse(userinSession));
        }
        else {
            setUserAuth({accessToken: null});
        }
    },[])

    return (
        // Used to create multiple routes in the application
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>
                <Route path = "/editor" element={<Editor />} />
                <Route path="/" element={<Navbar />}>
                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;