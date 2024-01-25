import './reset.css';
import Navbar from '../Navbar/Navbar.js';
import CreateJoinButtons from './Create-Join-Buttons/Create-Join-Buttons.js';
import CurrentEventsBox from './Current-Events-Box/Current-Events-Box.jsx';
import FutureEventsBox from './Future-Events-Box/Future-Events-Box.jsx';
import PastEventsBox from './Past-Events-Box/Past-Events-Box.jsx';
import Banner from '../GameListPage/Banner/Banner.jsx';
import EventBox from './Event-Box/EventBox.jsx';


function Homepage() {
  return (
    <div className="Homepage">
      <Navbar />
      <Banner
        imageLink={'https://wallpapers.com/images/hd/dark-gray-background-with-subtle-texture-00s6e87ze9udphqw.jpg'}
        isHomePageBanner={true}
        bannerText={"Esports Manager"}
        subText={'Unleash your inner champion'}
      />
      <CreateJoinButtons />
      <EventBox categoryName={'Recently Added'}/> 
      {/* use this component for now unless we get the carousel to work with axios */}
      
      
      {/* ----- old components below ----- */}
      
      {/* <CurrentEventsBox /> */}
      {/* <FutureEventsBox /> */}
      {/* <PastEventsBox categoryName={'Current Events'}/> */}
      {/* <PastEventsBox categoryName={'Past Events'}/> */}
    </div>
  );
}

export default Homepage;
