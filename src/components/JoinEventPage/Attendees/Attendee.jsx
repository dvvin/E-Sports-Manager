import './Attendee.css'

export default function Attendee({profileImage, username, handleClick}) {
    return (
        // old implementation keeping for reference for now

        // <div className="attendee-info-container">
        //     <div className="attendee-image-container">
        //         <img src={profileImage} alt="" className="attendee-profile-picture" />
        //     </div>
        //     <p className="attendee-username">{username}</p>
        // </div>

        <div className="attendee-info-container">
            <div className="attendee-image-container">
                <img src={profileImage} alt="" className="attendee-profile-picture" onClick={() => handleClick(username)} />
            </div>
            <p className="attendee-username">{username}</p>
        </div>
    )

}
