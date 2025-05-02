import { Calendar } from "lucide-react";
import { Check } from "./showCard";
import React from "react";
import { transfDateTime } from "../functions/checklist";

const DateChecklist = ({val}:{val:Check}) => {

   

    const datePassed = (date:string) => {
        if (!date) return false;
        console.log(date)
        const dataAlvo = new Date(date);
        const agora = new Date(); 
        
        return dataAlvo >= agora;
    };
      

    return(
        <React.Fragment>
            {val.concluido?(
                <>
                    {datePassed(val.dataHora)?(
                        <div className="flex items-center justify-center gap-1 bg-[#3FAE1B] w-[115px] h-[23px] rounded-[5px]" >
                            <Calendar
                                className="text-white"
                                size={12}
                            />
                            <p className="text-[10px]" >{transfDateTime(val.dataHora).date}-{transfDateTime(val.dataHora).time}</p>
                        </div>
                    ):(
                        <div className="flex items-center justify-center gap-1 bg-red-500 w-[115px] h-[23px] rounded-[5px]" >
                            <Calendar
                                className="text-white"
                                size={12}
                            />
                            <p className="text-[10px]" >{transfDateTime(val.dataHora).date}-{transfDateTime(val.dataHora).time}</p>
                        </div>
                        )}
                </>
            ):(
                <>
                    {datePassed(val.dataHora)?(
                        <div className="flex items-center justify-center gap-1 bg-white/80 w-[25px] h-[23px] rounded-[5px]" >
                            <Calendar
                                className="text-black"
                                size={16}
                            />
                        </div>
                    ):(
                        <div className="flex items-center justify-center gap-1 bg-red-500 w-[115px] h-[23px] rounded-[5px]" >
                            <Calendar
                                className="text-white"
                                size={12}
                            />
                            <p className="text-[10px]" >{transfDateTime(val.dataHora).date}-{transfDateTime(val.dataHora).time}</p>
                        </div>
                    )}
                </>
            )}
        </React.Fragment>
    );  
}

export default DateChecklist;