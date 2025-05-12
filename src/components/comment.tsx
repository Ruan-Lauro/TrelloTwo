import { useState, useRef } from "react";
import { Comentario, CardGetId } from "./showCard";
import { BsX, BsCheck } from "react-icons/bs";
import { GoPaperclip } from "react-icons/go";
import ImgUser from "./imgUser";
import { useCommentCard } from "../hooks/useGetComment";
import TextareaAutosize from 'react-textarea-autosize';

type CommentCardProps = {
  card?: CardGetId;
  update: () => void;
};

const CommentCard = ({ card, update }: CommentCardProps) => {
  const [comment, setComment] = useState("");
  const [anexo, setAnexo] = useState<File | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const { addComment, deleteComment } = useCommentCard();
  const fileInputRef = useRef(null);

  const handleAttachClick = () => {
    // @ts-ignore
    fileInputRef.current?.click(); 
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditCommentText(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnexo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!card || !comment.trim()) return;

    try {
      const commentData: any = {
        CardId: card.id,
        Comentario: comment,
      };

      if (anexo) {
        const blob = new Blob([anexo], { type: anexo.type });
        commentData.Anexo = blob;
      }

      const result = await addComment(commentData);
      if (result === true) {
        setComment("");
        setAnexo(null);
        update();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      const result = await deleteComment(id);
      if (result === true) {
        update();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const startEditing = (comment: Comentario) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.mensagem);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const saveEditedComment = async () => {
    alert("Função editar não foi implementada na API fornecida");
    setEditingCommentId(null);
    setEditCommentText("");
    update();
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="flex flex-col justify-between mt-10 text-white w-full">
      <p className="font-bold text-[24px] mb-10 sm:mb-5">Comentários</p>

      <div className="flex flex-col h-auto max-sm:mb-10">
            {anexo?(
              <div className="flex max-sm:self-center" >
                  <img className="w-[250px] h-[250px] object-cover mb-5" src={URL.createObjectURL(anexo)} alt={anexo.name} />
                  <BsX
                      className="ml-2 text-[20px] cursor-pointer hover:text-red-500"
                      onClick={() => setAnexo(null)}
                  />
              </div>
            ):null}
            <div className=" bg-3 flex items-center justify-center pt-3 pb-3 pl-3 pr-3 rounded-3xl h-auto w-full" >
                <TextareaAutosize
                value={comment}
                onChange={handleCommentChange}
                placeholder="Escreva um comentário"
                className="w-full bg-transparent focus:outline-none resize-none"
                />
           
            </div>
            <div className="flex px-4 py-2 items-center gap-3 self-end">
                
                 <button type="button" onClick={handleAttachClick} className="ml-2">
                    <GoPaperclip 
                      className="text-[16px] text-white/70 hover:text-white transition-all"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!comment.trim()}
                    className={`w-[119px] h-[36px] rounded-full ${
                    comment.trim() ? "bg-white/75 text-black hover:bg-white" : "bg-gray-500/50 cursor-not-allowed"
                    } transition-all`}
                >
                    Enviar
                </button>
            </div>
        </div>

      <div className="flex flex-col gap-10 sm:gap-4 mb-6 ">
        {card?.comentarios && card.comentarios.length > 0 ? (
          card.comentarios.map((comentario) => (
            <div key={comentario.id} className="flex gap-3 max-w-full">
              <div className="flex-shrink-0">
                <ImgUser id={0} img={comentario.foto} nome={comentario.usuario} color="bg-4" />
              </div>
              <div className="flex flex-col max-w-[80%] sm:max-w-[90%]">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className="font-bold">{comentario.usuario}</p>
                      <span className="text-4 text-sm ml-2">
                        {formatDateTime(comentario.dataHora)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {editingCommentId === comentario.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editCommentText}
                      onChange={handleEditCommentChange}
                      className="w-full bg-[#00447B]/40 p-2 rounded focus:outline-none resize-none min-h-[60px]"
                    />
                    <div className="flex mt-2 gap-2">
                      <button 
                        onClick={saveEditedComment}
                        className="flex items-center gap-1 hover:text-4 transition-all"
                      >
                        <BsCheck className="text-[18px]" />
                        Salvar
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="hover:text-red-500 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 break-words max-w-full">{comentario.mensagem}</p>
                    {comentario.anexo && comentario.anexo.length > 0?(
                      <img src={import.meta.env.VITE_LINK_API + comentario.anexo} alt="Comentário" className="w-[250px] h-[250px] object-cover mt-2" />
                    ):null}
                    <div className="flex mt-2 gap-4 text-sm">
                      <button 
                        onClick={() => startEditing(comentario)}
                        className="hover:text-4 transition-all"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comentario.id)}
                        className="hover:text-red-500 transition-all"
                      >
                        Excluir
                      </button>
                      <button className="hover:text-4 transition-all">
                        Responder
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/50 text-center py-4">Nenhum comentário ainda</p>
        )}
      </div>
    </div>
  );
};

export default CommentCard;