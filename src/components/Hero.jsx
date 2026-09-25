import { useRef, useEffect } from 'react';

const Hero = () => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 2;
        }
    }, [videoRef]);

    return (
            <section id="hero">
                <div>
                    <h1>MacBook Pro</h1>
                    <img src="/title.png" alt="MacBook title" />
                </div>

                <video ref={videoRef} src="/videos/hero.mp4" autoPlay muted playsInline/>
                <button>Buy</button>
                <p>From RM8999 or RM749/mo. for 12 mo. before trade-in</p>

            </section>
    )
}

export default Hero