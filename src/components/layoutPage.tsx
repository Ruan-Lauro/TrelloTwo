import { useState, useEffect } from "react";
import Header, { userToken } from "../components/header";
import MenuLeft from "../components/menuLeft";
import Footer from "./footer";
import LoadingAnimation from "./loading";
import ProfileSettingsModal from "./modalOption";
import NotificationToast from "./notification";

export type inforMessage = {
    id: number;
    nome: string;
    type: "group" | "user";
}

type LayoutPageType = {
    name: string;
    children: React.ReactNode;
    loadingValue: boolean;
    updateHeader?: number;
    inforMessage?: inforMessage;
};

function LayoutPage({name, children, loadingValue, updateHeader, inforMessage}: LayoutPageType) {
    const [menuLeftShow, setMenuLeftShow] = useState(true);
    const [menuTopShow, setMenuTopShow] = useState(true);
    const [loading, setLoading] = useState(loadingValue);
    const [openTwoMenu, setOpenTwoMenu] = useState(false);
    const [userData, setUserData] = useState<userToken>();
    
    useEffect(() => {
        const user = localStorage.getItem("user");
        if(user) {
            setUserData(JSON.parse(user));
        };
    }, [updateHeader])
    
    useEffect(() => {
        setLoading(loadingValue)
    }, [loadingValue])

    return(
        <main className="w-full h-screen">
            {loading ? (
                <LoadingAnimation/>
            ) : null}
            
        
            <NotificationToast timeoutMs={5000} inforMessage={inforMessage!} />
            
            <ProfileSettingsModal exit={() => {setOpenTwoMenu(false)}} isOpen={openTwoMenu} />
            
            <div className="w-full fixed top-0 z-4">
                <Header 
                    ShowTop={() => {
                        setMenuTopShow(!menuTopShow);
                    }}
                    functionSearch={()=>{}}  
                    name={name}
                    openMenuTwo={() => {
                        setOpenTwoMenu(true)
                    }}
                    userData={userData!}
                />
            </div>
            
            <section className={`flex h-full ${menuTopShow ? "pt-[200px] sm:pt-[130px]" : "pt-[20px]"}`}>
                <div className="fixed h-full z-2">
                    <MenuLeft 
                        ShowLeft={() => {
                            setMenuLeftShow(!menuLeftShow);
                        }}
                        nameLocal={name}
                        isAdmin={userData?.role === 1 ? true : false}
                    />
                </div>
                
                <div className={`relative flex flex-col w-full ${menuLeftShow ? "pl-[250px] md:pl-[326px]" : "pl-[20px]"}`}>
                    <div className="pb-[51px] h-full overflow-x-auto">
                        {children}
                    </div>
                    <Footer menuLeft={menuLeftShow} />
                </div>
            </section>
        </main>
    );
}

export default LayoutPage;