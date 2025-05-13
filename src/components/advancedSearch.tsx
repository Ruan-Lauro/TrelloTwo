import { ChangeEvent, useState, useEffect, useRef } from "react";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import { useGetWorkSpace } from "../hooks/useGetWorkSpace";
import { useGetUser } from "../hooks/useGetUser";
import ImgUser from "./imgUser";

// Define types for search results
type WorkspaceResult = {
  id: number;
  nome: string;
  type: 'workspace';
};

type CardResult = {
  id: number;
  titulo: string;
  workspaceId: number;
  type: 'card';
};

type UserResult = {
  id: number;
  nome: string;
  foto: string;
  type: 'user';
};

type SearchResult = WorkspaceResult | CardResult | UserResult;

type AdvancedSearchProps = {
  placeholder: string;
  typeTwo?: boolean;
}

export default function AdvancedSearch({ placeholder, typeTwo }: AdvancedSearchProps) {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { getWorkSpace, getWorkSpaceId } = useGetWorkSpace();
  const { getListUserNoSearch } = useGetUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultContainerRef.current && 
        !resultContainerRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      setIsSearching(true);
      setShowResults(true);
      performSearch(query);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const performSearch = async (query: string) => {
    try {
      const workspacesData = await getWorkSpace();
      
      const usersData = await getListUserNoSearch();
      const results: SearchResult[] = [];

      if (workspacesData && Array.isArray(workspacesData)) {
        const matchingWorkspaces = workspacesData
          .filter(workspace => workspace.nome.toLowerCase().includes(query.toLowerCase()))
          .map(workspace => ({
            id: workspace.id,
            nome: workspace.nome,
            type: 'workspace' as const
          }));
        
        results.push(...matchingWorkspaces);

        for (const workspace of workspacesData) {
          const workspaceDetails = await getWorkSpaceId(workspace.id);
          
          if (workspaceDetails && Array.isArray(workspaceDetails)) {
            for (const column of workspaceDetails[0].colunas) {
              if (column.cards) {
                const matchingCards = column.cards
                  .filter(card => 
                    card.titulo.toLowerCase().includes(query.toLowerCase()) || 
                    (card.descricao && card.descricao.toLowerCase().includes(query.toLowerCase()))
                  )
                  .map(card => ({
                    id: card.id,
                    titulo: card.titulo,
                    workspaceId: workspace.id,
                    type: 'card' as const
                  }));
                
                results.push(...matchingCards);
              }
            }
          }
        }
      }
      
      if (usersData.items && Array.isArray(usersData.items)) {
        const matchingUsers = usersData.items
          .filter((user: { nome: string; email: string; }) => 
            user.nome.toLowerCase().includes(query.toLowerCase()) || 
            user.email.toLowerCase().includes(query.toLowerCase())
          )
          .map((user: { id: any; nome: any; foto: any; }) => ({
            id: user.id,
            nome: user.nome,
            foto: user.foto,
            type: 'user' as const
          }));
        
        results.push(...matchingUsers);
      }
      
      const workspaceResults = results.filter(r => r.type === 'workspace');
      const cardResults = results.filter(r => r.type === 'card');
      const userResults = results.filter(r => r.type === 'user');
      
      setSearchResults([...workspaceResults, ...cardResults, ...userResults]);
      setIsSearching(false);
    } catch (error) {
      console.error('Error performing search:', error);
      setIsSearching(false);
    }
  };

  // Handle clicking on a search result
  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery("");
    
    switch (result.type) {
      case 'workspace':
        navigate(`/AreaDeTrabalho/${result.id}`);
        break;
      case 'card':
        navigate(`/AreaDeTrabalho/${result.workspaceId}`);
        break;
      case 'user':
        navigate(`/MensagemAoUsuario/${result.id}`);
        break;
    }
  };

  const handleSearchButtonClick = () => {
    if (searchQuery.length > 0) { 
      performSearch(searchQuery);
      setShowResults(true);
    }
  };

  const getNoResultsMessage = () => {
    if (searchQuery.length === 1) {
      return "Continue digitando para ver resultados mais específicos";
    }
    return `Nenhum resultado encontrado para "${searchQuery}"`;
  };

  return (
    <div className="relative w-full">
      <div className={`flex items-center ${typeTwo ? "bg-10" : "bg-2 text-white"} rounded-full w-full px-5`}>
        <input
          ref={searchInputRef}
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="bg-transparent w-full focus:outline-0 h-[60px]"
          onFocus={() => {
            if (searchQuery.length > 0) { 
              setShowResults(true);
            }
          }}
        />
        <ReactSVG
          className={`cursor-pointer hover:scale-105 transition-all duration-300 ${typeTwo ? "text-[#003B6B]" : "text-[#B2C4D3]"}`}
          src="/src/assets/svg/Search.svg"
          onClick={handleSearchButtonClick}
        />
      </div>

      {showResults && (
        <div 
          ref={resultContainerRef}
          className="absolute top-[70px] left-0 w-full bg-white rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto"
        >
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.some(r => r.type === 'workspace') && (
                <div className="px-4 py-2">
                  <h3 className="font-medium text-gray-500 text-sm">Workspaces</h3>
                  {searchResults
                    .filter(r => r.type === 'workspace')
                    .map((result, index) => (
                      <div 
                        key={`workspace-${index}`}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <ReactSVG src="/src/assets/svg/Workspace.svg" className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="max-w-[200px] truncate" >{(result as WorkspaceResult).nome}</span>
                      </div>
                    ))
                  }
                </div>
              )}

              {searchResults.some(r => r.type === 'card') && (
                <div className="px-4 py-2 border-t border-gray-200">
                  <h3 className="font-medium text-gray-500 text-sm">Cards</h3>
                  {searchResults
                    .filter(r => r.type === 'card')
                    .map((result, index) => (
                      <div 
                        key={`card-${index}`}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <ReactSVG src="/src/assets/svg/Card.svg" className="h-5 w-5 text-green-600" />
                        </div>
                        <span>{(result as CardResult).titulo}</span>
                      </div>
                    ))
                  }
                </div>
              )}

              {searchResults.some(r => r.type === 'user') && (
                <div className="px-4 py-2 border-t border-gray-200">
                  <h3 className="font-medium text-gray-500 text-sm">Usuários</h3>
                  {searchResults
                    .filter(r => r.type === 'user')
                    .map((result, index) => (
                      <div 
                        key={`user-${index}`}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md gap-2"
                        onClick={() => handleResultClick(result)}
                      >
                        <ImgUser img={(result as UserResult).foto} nome={(result as UserResult).nome} color="bg-4" id={(result as UserResult).id} size="w-[30px] h-[30px]" />
                        <span className="max-w-[150px] truncate" >{(result as UserResult).nome}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {getNoResultsMessage()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}