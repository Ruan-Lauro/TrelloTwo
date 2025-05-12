import { useEffect } from "react";
// import { useGetCard } from "../hooks/useGetCard";
import { CardGetId } from "./showCard";

const Status = ({card}:{card:CardGetId}) => {

    // const {editCard} = useGetCard();
    // const [status, setStatus] = useState(0);

    useEffect(()=>{
        if(card === undefined) return;
        
    },[]);

    return(
        <div className="w-[27px] h-[27px] border-white border-[2px] rounded-full bg-transparent" ></div>
    );
};

export default Status;