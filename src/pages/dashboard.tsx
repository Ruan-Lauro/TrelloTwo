import { ChangeEvent, useState } from "react";
import Header from "../components/header";


function Dashboard (){

    const [search, setSearch] = useState("");

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    return(
        <main className="" >
            <Header functionSearch={handleSearch} name="Dashboard" />
        </main>
    );
}

export default Dashboard;