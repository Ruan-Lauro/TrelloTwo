
type footer = {
    menuLeft: boolean;
}

export default function Footer ({menuLeft}:footer) {
    return(
        <footer className={`fixed bottom-0 bg-white w-full h-[51px] flex justify-center items-center ${menuLeft?"pr-[250px]":""}`} >
            <p className="text-[#CBCBCB] min-w-[300px]" >KBR TEC © Todos os direitos reservados</p>
        </footer>
    );
};