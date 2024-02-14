import {useEffect, useState} from "react";

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

type mngmntFunction = (chunk:number) => void;

function useWindowDimensions(onWindowResizeCallback: mngmntFunction) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            const newDimensions = getWindowDimensions();
            setWindowDimensions(newDimensions);
            onWindowResizeCallback(Math.floor(newDimensions.width / 175));
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);

    return windowDimensions;
}

export default useWindowDimensions;