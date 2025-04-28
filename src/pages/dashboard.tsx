import LayoutPage from "../components/layoutPage";
import LoadingAnimation from "../components/loading";



function Messages (){

    return(
        <LayoutPage name="Dashboard" loadingValue={false} >
            <main className="w-full" >
                {/* <LoadingAnimation/> */}
            </main>
        </LayoutPage>
    );
}

export default Messages;