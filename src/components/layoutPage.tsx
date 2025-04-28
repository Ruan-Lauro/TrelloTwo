import { ChangeEvent, useEffect, useState } from "react";
import Header from "../components/header";
import MenuLeft from "../components/menuLeft";
import Footer from "./footer";
import LoadingAnimation from "./loading";


type LayoutPageType = {
    name: string;
    children: React.ReactNode;
    loadingValue: boolean;
};

function LayoutPage ({name, children, loadingValue}:LayoutPageType){

    const [search, setSearch] = useState("");
    const [menuLeftShow, setMenuLeftShow] = useState(true);
    const [menuTopShow, setMenuTopShow] = useState(true);
    const [loading, setLoading] = useState(loadingValue);

    // useEffect(()=>{
    //     setLoading(loadingValue)
    // }, [loadingValue])

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    return(
        <main className="w-full h-screen" >
            {loading?(
                <LoadingAnimation/>
            ):null}
            <div className="w-full fixed top-0 z-4" >
                <Header ShowTop={()=>{
                    setMenuTopShow(!menuTopShow);
                }} functionSearch={handleSearch} name={name} />
            </div>
            <section className={`flex h-full ${menuTopShow?"pt-[200px] sm:pt-[130px]":"pt-[20px]"} `} >
                <div className="fixed h-full z-2" >
                    <MenuLeft ShowLeft={()=>{
                    setMenuLeftShow(!menuLeftShow);
                }} nameLocal={name} />
                </div>
                <div className={`relative flex flex-col w-full  ${menuLeftShow?"pl-[250px] md:pl-[326px]":"pl-[20px]"}`} >
                    <div className="pb-[51px] h-full overflow-x-auto" >
                        {children}
                    </div>
                    <Footer menuLeft={menuLeftShow} />
                </div>
            </section>
        </main>
    );
}

export default LayoutPage;