import './Banner.css'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'


export default function Banner({ imageLink = 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/isBqQ09k04Mc/v1/-1x-1.jpg',
    bannerText = null, subText=null, gameName = null, tournamentID = null, isHomePageBanner = null }) {

    const [bannerImage, setBannerImage] = useState(imageLink)


    useEffect(() => {
        async function loadGameBanner() {

            if (tournamentID !== null) {
                const response = await axios.get(`http://localhost:4000/join-event/${tournamentID}`);
                setBannerImage(response.data[0].tournamentImg);
            }

            if (gameName !== null && gameName !== 'all') {
                const response = await axios.get(`http://localhost:4000/events/${gameName}`);
                setBannerImage(response.data.gameBanner[0].gameBanner);
            }



        }
        if (gameName !== null || tournamentID !== null) {
            loadGameBanner();
        }
    }, [gameName, tournamentID])

    return (
        <section className="banner-section" style={{ backgroundImage: `url(${bannerImage})`, height: isHomePageBanner && '30vh' }}>

            {/* if banner text exists create header for it */}
            {bannerText ? <h1 className="browse-game-header">{bannerText}</h1> : null}
            {subText && <h2 className='browse-game-header' style={{color: '#5aa56e' ,fontSize: '2rem', fontWeight: 'bold'}}>{subText}</h2>}


        </section>
    )
}
