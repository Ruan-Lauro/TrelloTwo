import { useGetUser } from "../hooks/useGetUser";

const {getListUserNoSearch} = useGetUser();

export const nameOfUser = async (name: string) => {
  const list = await getListUserNoSearch();
  const user = list.items.find((val: { nome: string }) => val.nome === name);
  return user?.id ?? null;
};

