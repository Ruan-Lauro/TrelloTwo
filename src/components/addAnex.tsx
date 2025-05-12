import { BiSolidImageAdd } from "react-icons/bi";
import { useRef } from "react";
import { useGetCard } from "../hooks/useGetCard";
import ImgAnex from "./imgAnex";

interface ImageItem {
    anexoId: number;
    linkArquivo: string;
}

type AddAnexProps = {
    listAnex: any[],
    CardId: number,
    update: () => void;
};

const AddAnex = ({ CardId, listAnex, update }: AddAnexProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const { addAnexCard, deleteAnex } = useGetCard();

    const openImg = () => {
        ref.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const formData = new FormData();
            formData.append("CardId", String(CardId));
            formData.append("Anexo", file);

            const res = addAnexCard(formData);
            res.then(val => {
                console.log(val);
                update();
            });
        }
    };

    const handleDownload = async (image: ImageItem) => {
        try {
            const response = await fetch(import.meta.env.VITE_LINK_API + image.linkArquivo);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "arquivo.png";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar o arquivo:", error);
        }
    };

    const handleDelete = (id: number) => {
        const res = deleteAnex(id);
        res.then(val => {
            if (typeof val == "boolean" && val) {
                update();
            }
        })
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-white">
                <p className="font-bold text-2xl">Anexos</p>
                <BiSolidImageAdd
                    className="text-3xl cursor-pointer hover:scale-105 transition-transform duration-300 mt-1"
                    onClick={openImg}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={ref}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <p>Total: {listAnex.length}</p>
            </div>

            {listAnex.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                    {listAnex.map((item, index) => (
                        <ImgAnex 
                            key={index}
                            currentIndex={index} 
                            deleteImg={() => handleDelete(item.anexoId)} 
                            dowload={() => handleDownload(item)} 
                            listAnex={listAnex} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddAnex;