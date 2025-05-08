import { useEffect, useState } from "react";

const LoadingLetter = () => {

    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
        setDots(prevDots => {
            if (prevDots.length >= 3) {
            return '';
            }
            return prevDots + '.';
        });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center">
                    <p className="text-xl font-medium text-1">Carregando Mensagens{dots}</p>
                </div>
            </div>
        </div>
    );

};  

export default LoadingLetter;