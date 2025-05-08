import React, { useState, ChangeEvent } from 'react';
import { useGetGroup } from "../hooks/useGetGroup";

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
}

function CreateGroupModal({ onClose, onSuccess, userId }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [groupPhoto, setGroupPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { createGroup, getAllGroups, addUserToGroup } = useGetGroup();

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGroupPhoto(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('O nome do grupo é obrigatório');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createGroup(groupName, groupPhoto || undefined);
      
      if (result === true) {
        const list = await getAllGroups();
        if(typeof list !== "string" && list){
            const res = list.filter(val=>val.nome === groupName);
            console.log(res)
            console.log(list)
            const val = await addUserToGroup(res[0].id, userId);
            if(typeof val === "boolean" && val){
                onSuccess();
            }
        }
       
      } else {
        setError(typeof result === 'string' ? result : 'Erro ao criar grupo');
      }
    } catch (err) {
      setError('Erro ao criar grupo. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-1">Criar Novo Grupo</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="groupName" className="block text-gray-700 mb-2">Nome do Grupo</label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
              placeholder="Digite o nome do grupo"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="groupPhoto" className="block text-gray-700 mb-2">Foto do Grupo (Opcional)</label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setGroupPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
              
              <div className="flex-1">
                <input
                  id="groupPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="groupPhoto"
                  className="inline-block bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  Escolher Imagem
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;