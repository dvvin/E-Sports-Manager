import React, { useEffect, useRef } from 'react';
import Flickity from 'flickity';
import './future-events.css';
import './flick.css';
import './reset.css';

function FutureEventsBox() {
    const carouselRef = useRef(null);

    useEffect(() => {
        const flkty = new Flickity(carouselRef.current, {
            cellAlign: 'left',
            wrapAround: true,
            freeScroll: true,
        });

        return () => {
            flkty.destroy();
        };
    }, []);

    return (
        <section>
            <h3>FUTURE EVENTS</h3><div className="multi-img-carousel" ref={carouselRef}>
                <div className="carousel_button"></div>

                <div className="carousel_slide">
                    <img src="https://th.bing.com/th/id/R.01f9be275f6465e02b454dca581889a1?rik=B0gCaCc3%2bwsKdg&pid=ImgRaw&r=0" alt="" />
                </div>

                <div className="carousel_slide">
                    <img src="https://i.ytimg.com/vi/5olvW7WVVgY/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AH-BIAC6AKKAgwIABABGGIgYihiMA8=&rs=AOn4CLDxjXlRIFOPVmgihK5sv8dpzT6trw" alt="" />
                </div>

                <div className="carousel_slide">
                    <img src="https://img.freepik.com/premium-vector/upcoming-events-announcement-megaphone-label-loudspeaker-speech-bubble_123447-5297.jpg" alt="" />
                </div>

                <div className="carousel_button"></div>
            </div>
        </section>
    );
}

export default FutureEventsBox;
