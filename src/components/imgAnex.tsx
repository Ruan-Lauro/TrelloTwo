import { FiDownload, FiTrash2 } from "react-icons/fi";

const ImgAnex = ({deleteImg, dowload, listAnex, currentIndex}:{currentIndex:number; listAnex:any[]; dowload:()=>void; deleteImg:()=>void}) =>{
    return(
        <div className="relative w-[200px] p-4 flex flex-col items-center gap-3">
            <img
                src={import.meta.env.VITE_LINK_API+listAnex[currentIndex].linkArquivo}
                alt="Anexo"
                className="w-[157px] h-[90px] rounded-md object-contain border border-gray-300"
            />
            <p className="text-white font-medium">Arquivo {currentIndex+1} </p>
            {/* <p className="text-gray-300 text-sm">
                Adicionado há {formatDate(listAnex[currentIndex].date)}
            </p> */}
            <div className="flex gap-6 mt-2">
                <button onClick={dowload} className="text-white hover:text-green-300 transition-all cursor-pointer">
                    <FiDownload className="text-2xl" />
                </button>
                <button onClick={deleteImg} className="text-white hover:text-red-400 transition-all cursor-pointer">
                    <FiTrash2 className="text-2xl" />
                </button>
            </div>
        </div>
    );
}

export default ImgAnex;