import './LoadContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faGamepad } from '@fortawesome/free-solid-svg-icons';


export default function LoadContent({ loadingMessage = null, spinnerColor = 'black', icon = null }) {
    return (
        <div className='loading-section'>

            {icon !== 'gamepad' && <div className='loading-spinner'> <FontAwesomeIcon icon={faSpinner} spinPulse size="2xl" style={{ color: { spinnerColor } }} /></div>}

            {icon === 'gamepad' && <div className='loading-spinner'><FontAwesomeIcon icon={faGamepad} bounce size="2xl" style={{ color: { spinnerColor } }} /></div>}

            <div className='loading-text'>{loadingMessage}</div>
        </div >
    )
}