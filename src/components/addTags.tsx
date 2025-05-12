import { ChangeEvent, useEffect, useState } from "react";
import { useGetTag } from "../hooks/useGetTag";
import { Tag } from "./showCard";
import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { BsCheck } from "react-icons/bs";

type addTags = {
    cardListTag: Tag[];
    update: ()=>void;
    cardId: number;
}

type tagCard = {
    inforCard: Tag;
    isInCard: boolean;
};

const AddTags = ({cardListTag, update, cardId}:addTags) => {

    const [listCard, setListCard] = useState<tagCard[]>([]);
    const [search, setSearch] = useState("");
    const [nameTag, setNameTag] = useState("");
    const [colorTag, setColorTag] = useState("");
    const [showCreateTag, setShowCreateTag] = useState(false);
    
    const { getTag, setTagCard, removeTagCard, addTag } = useGetTag();

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    const handleNameTag = (e: ChangeEvent<HTMLInputElement>) => {
        setNameTag(e.currentTarget.value);
    };

    const handleColor = (e: ChangeEvent<HTMLInputElement>) => {
        setColorTag(e.currentTarget.value);
    };

    useEffect(() => {
        const list = getTag();
    
        list.then(val => {
            const filtered = search.trim() !== ""
                ? val.filter(tag => tag.titulo.toLowerCase().includes(search.toLowerCase()))
                : val;
    
            const newCards = filtered.map(res => ({
                inforCard: {
                    id: res.id,
                    titulo: res.titulo,
                    cor: res.cor,
                },
                isInCard: cardListTag.some(ele => ele.tagId === res.id)
            }));
    
            setListCard(newCards);
        });
    }, [cardListTag, search]);

    console.log(cardListTag)

    const addNewTagCard = (tagId:number) =>{
        const res = setTagCard({cardId,tagId});
        res.then(val=>{
            if(typeof val === "boolean" && val){
                update();
            }
        })
    };
    
    const deleteTag = (id:number) =>{
        const idCardTag = cardListTag.filter(val=>val.tagId === id);
        const res = removeTagCard({tagBondId:idCardTag[0].id!});
        res.then(val=>{
            if(typeof val === "boolean" && val){
                update();
            }
        }) 
    }

    const createTag = () => {
        if(colorTag && nameTag){
            const res = addTag({cardId, cor: colorTag, titulo: nameTag});
            res.then(val=>{
                if(typeof val === "boolean" && val){
                    update();
                }
            })
        }
    }
    
    return(
        <div className="absolute z-10 left-[40%] top-[30%] w-[300px] flex flex-col bg-2 border-[1px] border-white/30 text-white rounded-[10px] mt-2 pb-5 max-h-[403px] px-3" >
            <p className="font-bold text-[18px] mt-3 text-center" >Tags</p>
            <input type="text" className="mt-5 self-center w-[90%] h-[35px] bg-white focus:outline-0 rounded-[5px] pl-3 placeholder:text-black/70 placeholder:font-semibold text-black" placeholder="Search" onChange={handleSearch} />
            <div className="pl-1 pt-3 pb-3 flex flex-col gap-2 w-[100%] items-center mt-3 max-h-[182px] overflow-y-auto bg-2/55 rounded-[10px]" >
                {listCard.length > 0?(
                    <>
                        {listCard.map(res=>(
                            <React.Fragment key={res.inforCard.id} >
                                {res.isInCard?(
                                    <div className="flex gap-3 items-center w-[99%]" onClick={()=>{
                                        deleteTag(res.inforCard.id);
                                    }} >
                                        <div className="w-[23px] h-[20px] bg-white border-white border-[2px] rounded-[5px] hover:bg-transparent group cursor-pointer" >
                                            <IoMdCheckmark className="text-1 flex group-hover:hidden" />
                                        </div>
                                        <div className={`flex items-center justify-center w-full  h-[35px] rounded-[5px] ${res.inforCard.cor === "#000000"?"":"text-white"} font-bold truncate`} style={{background: res.inforCard.cor}} ><p>{res.inforCard.titulo}</p></div>
                                    </div>
                                ):(
                                    <div className="flex gap-3 items-center w-[99%] cursor-pointer" onClick={()=>{
                                        addNewTagCard(res.inforCard.id);
                                    }} >
                                        <div className="w-[23px] h-[20px] bg-transparent border-white border-[2px] rounded-[5px] hover:bg-white group" >
                                            <IoMdCheckmark className="text-1 hidden group-hover:flex" />
                                        </div>
                                        <div className={`flex items-center justify-center w-full h-[35px] rounded-[5px] ${res.inforCard.cor === "#ffffff" || res.inforCard.cor === "#FFFFFF"?"text-1":"text-white"} font-bold truncate`} style={{background: res.inforCard.cor}} >
                                            <p>{res.inforCard.titulo}</p>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </>
                ):null}
            </div>
            {showCreateTag?(
                <div className="flex items-center justify-between mt-3 self-center w-[100%] h-[35px]" >
                    <input type="color" className="w-[25px] h-[30px] rounded-full" onChange={handleColor} value={colorTag} />
                    <input type="text" className=" focus:outline-0 border-b-white border-b-[2px]" onChange={handleNameTag} value={nameTag} />
                    <BsCheck className="text-[40px] cursor-pointer hover:text-8" onClick={()=>{
                        createTag();
                    }}/>
                </div>
            ):null}
            <div className={`cursor-pointer mt-3 self-center w-[50%] h-[35px] rounded-[5px] flex items-center justify-center font-bold ${showCreateTag?"bg-4 text-white hover:bg-white hover:text-1":"bg-white text-1 hover:bg-4 hover:text-white"}`} onClick={()=>{setShowCreateTag(!showCreateTag)}} ><p>{showCreateTag?"Não Criar":"Criar Tag"}</p></div>
        </div>
    );
};

export default AddTags;