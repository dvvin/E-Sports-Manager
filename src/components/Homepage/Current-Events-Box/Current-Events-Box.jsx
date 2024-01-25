import { Link } from 'react-router-dom';
import './current-events-box.css'
import { useState } from 'react';

export function useSlideshow(initialSlide = 1) {
    const [slideIndex, setSlideIndex] = useState(initialSlide);

    const plusSlides = (n) => {
        setSlideIndex(prev => {
            let newSlide = prev + n;
            if (newSlide > 2) return 1;   // assuming 2 slides, adjust as needed
            if (newSlide < 1) return 2;
            return newSlide;
        });
    }

    return { slideIndex, plusSlides };
}

function CurrentEventsBox() {
    const { slideIndex, plusSlides } = useSlideshow();

    return (
        <section>
            <div className="slideshow-container">

                {slideIndex === 1 && (
                    <Link to="/events/all">
                        <div className="mySlides fade">
                            <img src="https://www.eriecbdd.org/wp-content/uploads/2020/07/Current-Events.png" alt="Current Events" />
                        </div>
                    </Link>
                )}

                {slideIndex === 2 && (
                    <div className="mySlides fade">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmh17def2PbpJJvROcO03NfCIs4tffT6KDGQ&usqp=CAU" alt="Another Event" />
                    </div>
                )}

                <button className="prev" onClick={() => plusSlides(-1)}>❮</button>
                <button className="next" onClick={() => plusSlides(1)}>❯</button>

            </div>
        </section>
    );
}

export default CurrentEventsBox;
