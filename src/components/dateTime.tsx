import { Calendar, Clock } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import AcceptAndClose from "./AcceptAndClose";


type dateTime = {
    handleDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
    dateCard: string;
    handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
    timeCard: string;
    close: ()=>void;
    add:()=>void;
    trueEditCard: boolean;
}

const DateTime = ({add, close, dateCard, handleDateChange, handleTimeChange, timeCard, trueEditCard}:dateTime) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefH = useRef<HTMLInputElement & { showPicker?: () => void }>(null);

    const openCalendar = () => {
        inputRef.current?.showPicker?.();
    };

    const openTimePicker = () => {
        inputRefH.current?.showPicker?.();
    };

    return(
        <div className="flex gap-3" >
            <div className="cursor-pointer relative flex items-center pl-2 w-[149px] h-[31px] rounded-[5px] bg-white/80 text-black hover:bg-white">
                <Calendar
                    className="cursor-pointer mr-2 hover:text-1"
                    size={16}
                    onClick={openCalendar}
                />
                <input
                    ref={inputRef}
                    type="date"
                    className="w-[95px] rounded-md focus:outline-none cursor-pointer"
                    onChange={handleDateChange}
                    value={dateCard}
                />
            </div>
            <div className="cursor-pointer relative flex items-center pl-2 w-[96px] gap-3 h-[31px] rounded-[5px] bg-white/80 text-black hover:bg-white">
                <Clock
                    className="cursor-pointer hover:text-1"
                    size={16}
                    onClick={openTimePicker}
                />
                <input
                    ref={inputRefH}
                    type="time"
                    className="rounded-md focus:outline-none cursor-pointer"
                    onChange={handleTimeChange}
                    value={timeCard}
                />
            </div>
            {trueEditCard?(
                <div className="flex" >
                    <AcceptAndClose add={add} close={close} />
                </div>
            ):null}
        </div>
    );

};

export default DateTime;