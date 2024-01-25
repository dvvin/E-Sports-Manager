const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventsURI = process.env.Events_URI;

const tournamentConnection = mongoose.createConnection(EventsURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

tournamentConnection.on('connected', () => {
    console.log('Tournament connected');
});

const tournamentSchema = new mongoose.Schema({
    hasStarted: {
        type: Boolean,
        required: true,
        default: false
    },

    tournamentImg: {
        type: String,
        required: true,
        default: "https://upload.wikimedia.org/wikipedia/commons/d/d6/TournamentLogo_v19.png"
    },
    tournamentGame: {
        type: String,
        required: true
    },
    tournamentTitle: {
        type: String,
        required: true,
        unique: true
    },
    tournamentLocation: {
        type: String,
        required: true
    },
    tournamentSignUpStartDate: {
        type: Date,
        required: true
    },
    tournamentSignUpEndDate: {
        type: Date,
        required: true
    },
    tournamentStartDate: {
        type: Date,
        required: true
    },
    tournamentEndDate: {
        type: Date,
        required: true
    },
    
    numPlayers: {
        type: Number,
        required: true,
    },
    bracketType: {
        type: String,
        lowercase: true,
        enum: ['single elimination', 'double elimination', 'round robin'],
        required: true
    },
    tournamentStartTime: {
        type: String,
        required: true

    },
    tournamentDescription: {
        type: String,
        required: true
    },
    tournamentPrize: {
        type: String,
    },
    tournamentRules: {
        type: String,
        required: true
    },

    organizerUserName: {
        type: String,
        required: true
    },

    organizerEmail: {
        type: String,
        required: true,
    },

    organizerPhoneNum: {
        type: String,
        required: true
    },

    tournamentAttendees: {
        type: Number,
        default: 0
    },

    tournamentAttendeeList: [
        {
            name: {
                type: String,
                required: true,
            },

            score: {
                type: Number,
                default: 0,
                required: true
            },
            hasWon: {
                type: Boolean,
                default: false,
                required: true
            },
            hasLost: {
                type: Boolean,
                default: false,
                required: true
            },
            isWinner: {
                type: Boolean,
                default: false,
                required: true
            }
        }
    ],

    startingAttendeeList: [
        {
            name: {
                type: String,
                required: true,
            },

            score: {
                type: Number,
                default: 0,
                required: true
            },
            hasWon: {
                type: Boolean,
                default: false,
                required: true
            },
            hasLost: {
                type: Boolean,
                default: false,
                required: true
            },
            isWinner: {
                type: Boolean,
                default: false,
                required: true
            }
        }
    ],

    tournamentMaxScore: {
        type: Number,
        required: true,
        
    }
})


const Tournament = tournamentConnection.model('Tournament', tournamentSchema);
module.exports = Tournament;