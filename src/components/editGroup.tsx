import { useState } from 'react';
import { useGetGroup, Group, GroupUser } from '../hooks/useGetGroup';
import { useNavigate } from 'react-router-dom';
import { user } from '../hooks/useGetUser';
import ImgUser from './imgUser';

type EditGroupProps = {
  group: Group;
  onClose: () => void;
  onSuccess: () => void;
  list: GroupUser[];
  isAdmin: boolean;
  currentUser: user;
  handleRemoveUser: (userId: number)=>void;
};

const EditGroup = ({ group, onClose, onSuccess, currentUser, handleRemoveUser, isAdmin, list }: EditGroupProps) => {

  const { editGroup, deleteGroup } = useGetGroup();
  const [name, setName] = useState(group.nome);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(group.foto || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('O nome do grupo é obrigatório');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await editGroup(group.id, name, photo || undefined);
      
      if (typeof result === 'boolean' && result) {
        onSuccess();
        onClose();
      } else {
        setError(typeof result === 'string' ? result : 'Erro ao editar grupo');
      }
    } catch (err) {
      setError('Ocorreu um erro ao salvar as alterações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await deleteGroup(group.id);
      
      if (typeof result === 'boolean' && result) {
        navigate("/Mensagens");
      } else {
        setError(typeof result === 'string' ? result : 'Erro ao excluir grupo');
      }
    } catch (err) {
      setError('Ocorreu um erro ao excluir o grupo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-sm:h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-1">
            {isDeleting ? 'Excluir Grupo' : 'Editar Grupo'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isDeleting ? (
          <div className="py-4">
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir o grupo <span className="font-bold">{group.nome}</span>? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition cursor-pointer"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-200 flex items-center justify-center relative">
                {photoPreview ? (
                  <img 
                    src={photoPreview.includes("/api")?import.meta.env.VITE_LINK_API+photoPreview:photoPreview} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-500">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <label htmlFor="group-photo" className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              
              <input
                id="group-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              
              <label htmlFor="group-photo" className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm">
                Alterar foto
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="group-name" className="block text-sm font-medium text-1 mb-1">
                Nome do grupo
              </label>
              <input
                id="group-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                placeholder="Digite o nome do grupo"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsDeleting(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                disabled={isLoading}
              >
                Excluir Grupo
              </button>
              
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        )}

         <div className="bg-white lg:flex flex-col w-full mt-10">
            <h2 className="text-2 font-bold text-[24px] mb-5">Membros do Grupo</h2>
            <div className="flex flex-col gap-4 h-[300px] overflow-y-auto pr-2">
                {list.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ImgUser color="bg-4" nome={member.nome} img={member.foto} id={member.id} />
                            <p className="font-bold text-[16px] truncate max-w-[150px]">{member.nome}</p>
                        </div>
                        
                        {isAdmin && member.nome !== currentUser?.name && (
                            <button 
                                onClick={() => handleRemoveUser(member.id)}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditGroup;