const GlobalUtilities = require('./Utilities/GlobalUtilities');
const Clock =  require('../utils/Clock');
const {ManageHouseGoal, ManageHouseIntention} = require('./Goals_Intentions/HouseManager');
const {WakeUpGoal, WakeUpIntention} = require('./Goals_Intentions/WakeUpManager');
const {SenseMovementsGoal, SenseMovementsIntention} = require('./Goals_Intentions/MovementSensor');
const {ManageLightsGoal, ManageLightsIntention, 
    AutoTurnLightOnOffGoal, AutoTurnLightOnOffIntention} = require('./Goals_Intentions/LightManager');
const {ManageConsumptionGoal, ManageConsumptionIntention} = require('./Goals_Intentions/ConsumptionManager');
const {ManageThermostatsGoal, ManageThermostatsIntention} = require('./Goals_Intentions/ThermostatManager');
const {CleanlinessGoal, CleanlinessIntention} = require('./Goals_Intentions/CleanerManager');
const {VacuumCleanerGoal, VacuumCleanerIntention} = require('./Goals_Intentions/VacuumCleanerManager');
const {ManageRollUpShuttersGoal, ManageRollUpShuttersIntention} = require('./Goals_Intentions/RollUpShutterManager');
const house =  require('./Classes/House');
const houseAgent = require('./Agents/House/HouseAgent');
const vacuumCleanerAgents = require('./Agents/VacuumCleaner/VacuumCleanerAgent');
const {DaysEnum, MonthsEnum} = require('./Utilities/Calendar');
const sensor = require('./Agents/VacuumCleaner/VacuumCleanerSensor');
const logger = require('./Utilities/Logger');
const { ManageSolarPanelIntention, ManageSolarPanelGoal } = require('./Goals_Intentions/SolarPanelManager');


houseAgent.intentions.push(ManageHouseIntention);
houseAgent.postSubGoal(new ManageHouseGoal(DaysEnum.monday));

houseAgent.intentions.push(WakeUpIntention);
houseAgent.postSubGoal(new WakeUpGoal(house.getRoom('bedroom')));

houseAgent.intentions.push(SenseMovementsIntention);
houseAgent.postSubGoal(new SenseMovementsGoal(house.people, house.rooms));

houseAgent.intentions.push(ManageLightsIntention);
houseAgent.postSubGoal(new ManageLightsGoal(house.rooms));

houseAgent.intentions.push(AutoTurnLightOnOffIntention);
houseAgent.postSubGoal(new AutoTurnLightOnOffGoal(house.rooms));

houseAgent.intentions.push(ManageThermostatsIntention);
houseAgent.postSubGoal(new ManageThermostatsGoal(house.rooms));

houseAgent.intentions.push(ManageConsumptionIntention);
houseAgent.postSubGoal(new ManageConsumptionGoal(house.rooms));

houseAgent.intentions.push(ManageRollUpShuttersIntention);
houseAgent.postSubGoal(new ManageRollUpShuttersGoal(house.rooms));

houseAgent.intentions.push(ManageSolarPanelIntention);
houseAgent.postSubGoal(new ManageSolarPanelGoal(house.getRoom('pantry')));

let vacuumCleaners = {};
 for (let vacuumCleaner of vacuumCleanerAgents) {
    if (GlobalUtilities.isValidObj(vacuumCleaner.getDevice())) {
        vacuumCleaners[vacuumCleaner.getOperationLevel()] = vacuumCleaner.getDevice();

        vacuumCleaner.intentions.push(VacuumCleanerIntention);
        vacuumCleaner.postSubGoal(new VacuumCleanerGoal());
    }

    houseAgent.beliefs.observeAny(sensor(vacuumCleaner));
}

if (GlobalUtilities.isValidObj(vacuumCleaners)) {
    houseAgent.intentions.push(CleanlinessIntention);
    houseAgent.postSubGoal(new CleanlinessGoal(house.getRoomList(), vacuumCleaners, 5));
}

//Check and update temperature 
Clock.global.observe('hh', (key, hh) =>{
    if (Clock.global.hh % 3 == 0) {
        for (let [key_t, room] of Object.entries(house.rooms)) {
            if (room.devices.thermostat)
                room.devices.thermostat.updateTemperature();
        }
    }
})

// Daily schedule
Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global

    // enable if you don't want to
    // run all the simulation

    // if (time.dd > DaysEnum.tuesday) {
    //     // Stop clock
    //     Clock.stopTimer();
    //     logger.close();
    //     process.exit(0);
    // }

    if (time.dd <= DaysEnum.friday) {
        if (time.hh == houseAgent.alarmClock.getHH() &&
             time.mm == (houseAgent.alarmClock.getMM() + 5)) {
            houseAgent.turnOffAlarmClock();
        }
        
        if (time.hh == 6 && time.mm == 50) {
            house.people.Adam.moveTo('ff_bathroom');
            house.people.Ashley.moveTo('ff_bathroom');
        }

        if (time.hh == 7 && time.mm == 0) {
            house.people.Adam.moveTo('kitchen');
            house.people.Ashley.moveTo('kitchen');
        }

        if (time.hh == 7 && time.mm == 15) {
            house.people.Adam.moveTo('ff_bathroom');
            house.people.Ashley.moveTo('ff_bathroom');
        }

        if (time.hh == 7 && time.mm == 30) {
            house.people.Adam.moveTo('study');
            house.people.Ashley.moveTo('outside');
        }

        if (time.hh == 13 && time.mm == 00) {
            house.people.Adam.moveTo('kitchen');
        }

        if (time.hh == 13 && time.mm == 30) {
            house.people.Adam.moveTo('study');
        }

        if (time.hh == 16 && time.mm == 45) {
            house.people.Adam.moveTo('living_room');
        }

        if (time.hh == 17 && time.mm == 15) {
            house.people.Ashley.moveTo('living_room');
        }
    } 
    else if (time.dd >= DaysEnum.saturday && time.dd <= DaysEnum.sunday) {
        if (time.hh == 7 && time.mm == 45) {
            house.people.Adam.moveTo('ff_bathroom');
            house.people.Ashley.moveTo('ff_bathroom');
        }

        if (time.hh == 8 && time.mm == 0) {
            house.people.Adam.moveTo('kitchen');
            house.people.Ashley.moveTo('kitchen');
        }

        if (time.hh == 8 && time.mm == 45) {
            house.people.Adam.moveTo('ff_bathroom');
            house.people.Ashley.moveTo('ff_bathroom');
        }

        if (time.hh == 9 && time.mm == 00) {
            house.people.Adam.moveTo('garage');
            house.people.Ashley.moveTo('living_room');
        }

        if (time.hh == 10 && time.mm == 00) {
            house.people.Adam.moveTo('living_room');
        }

        if (time.hh == 12 && time.mm == 00) {
            house.people.Adam.moveTo('kitchen');
            house.people.Ashley.moveTo('kitchen');
        }

        if (time.hh == 14 && time.mm == 00) {
            house.people.Adam.moveTo('gf_bathroom');
            house.people.Ashley.moveTo('ff_bathroom');
        }

        if (time.hh == 14 && time.mm == 20) {
            house.people.Adam.moveTo('outside');
            house.people.Ashley.moveTo('outside');
        }

        if (time.hh == 19 && time.mm == 00) {
            house.people.Adam.moveTo('garage');
            house.people.Ashley.moveTo('kitchen');
        }

        if (time.hh == 19 && time.mm == 30) {
            house.people.Adam.moveTo('kitchen');
        }

        if (time.hh == 21 && time.mm == 00) {
            house.people.Adam.moveTo('living_room');
            house.people.Ashley.moveTo('living_room');
        }
    }

    switch (time.dd) {
        case DaysEnum.monday:
            {
                if (time.hh == 18 && time.mm == 45) {
                    house.people.Adam.moveTo('outside');
                    house.people.Ashley.moveTo('outside');
                }

                if (time.hh == 21 && time.mm == 00) {
                    house.people.Adam.moveTo('kitchen');
                    house.people.Ashley.moveTo('kitchen');
                }

                if (time.hh == 21 && time.mm == 45) {
                    house.people.Adam.moveTo('living_room');
                    house.people.Ashley.moveTo('living_room');
                }
            }
            break;
        case DaysEnum.tuesday:
            {
                if (time.hh == 20 && time.mm == 00) {
                    house.people.Adam.moveTo('kitchen');
                    house.people.Ashley.moveTo('kitchen');
                }

                if (time.hh == 21 && time.mm == 00) {
                    house.people.Adam.moveTo('study');
                    house.people.Ashley.moveTo('living_room');
                }
            }
            break;
        case DaysEnum.wednesday:
            {
                if (time.hh == 18 && time.mm == 45) {
                    house.people.Adam.moveTo('outside');
                    house.people.Ashley.moveTo('outside');
                }

                if (time.hh == 21 && time.mm == 00) {
                    house.people.Adam.moveTo('kitchen');
                    house.people.Ashley.moveTo('kitchen');
                }

                if (time.hh == 21 && time.mm == 45) {
                    house.people.Adam.moveTo('living_room');
                    house.people.Ashley.moveTo('living_room');
                }
            }
            break;
        case DaysEnum.thursday:
            {
                if (time.hh == 18 && time.mm == 45) {
                    house.people.Adam.moveTo('outside');
                    house.people.Ashley.moveTo('outside');
                }

                if (time.hh == 21 && time.mm == 00) {
                    house.people.Adam.moveTo('kitchen');
                    house.people.Ashley.moveTo('kitchen');
                }

                if (time.hh == 21 && time.mm == 45) {
                    house.people.Adam.moveTo('living_room');
                    house.people.Ashley.moveTo('living_room');
                }
            }
            break;
        case DaysEnum.friday:
            {
                if (time.hh == 19 && time.mm == 00) {
                    house.people.Adam.moveTo('outside');
                    house.people.Ashley.moveTo('outside');
                }

                if (time.hh == 22 && time.mm == 30) {
                    house.people.Adam.moveTo('living_room');
                    house.people.Ashley.moveTo('living_room');
                }
            }
            break;
        case DaysEnum.saturday:
            { }
            break;
        case DaysEnum.sunday:
            { }
            break;
        default:
            {
                // Stop clock
                Clock.stopTimer();
                process.exit(0);
            }
    }

    if (time.hh == 22 && time.mm == 45) {
        house.people.Adam.moveTo('ff_bathroom');
        house.people.Ashley.moveTo('ff_bathroom');
    }    

    if (time.hh == 23 && time.mm == 15) {
        house.people.Adam.moveTo('bedroom');
        house.people.Ashley.moveTo('bedroom');
    }
})

// Start clock
Clock.startTimer();
