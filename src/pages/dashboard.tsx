import LayoutPage from "../components/layoutPage";
import LoadingAnimation from "../components/loading";
import WaveHeader from "../components/teste";



function Messages (){

    return(
        <LayoutPage name="Dashboard" loadingValue={false} >
            <main className="w-full" >
                {/* <LoadingAnimation/> */}
                <WaveHeader/>
            </main>
        </LayoutPage>
    );
}

export default Messages;