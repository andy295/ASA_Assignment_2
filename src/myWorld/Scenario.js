const House =  require('./Classes/House');
const Agent = require('../bdi/Agent');
const Clock =  require('../utils/Clock');
const {DaysEnum, MonthsEnum} = require('./Utilities/Calendar');
const {AlarmGoal, AlarmIntention} = require('./Goals_Intentions/AlarmManager');
const {SenseMovementsGoal, SenseMovementsIntention} = require('./Goals_Intentions/MovementSensor');
const {ManageLightsGoal, ManageLightsIntention} = require('./Goals_Intentions/LightManager');
const {ManageConsumptionGoal, ManageConsumptionIntention} = require('./Goals_Intentions/ConsumptionManager');
const {ManageThermostatsGoal, ManageThermostatsIntention} = require('./Goals_Intentions/ThermostatManager');

// House, which includes people, rooms and devices
var house = new House();

// Agents
var agent = new Agent('house_agent');
agent.beliefs.declare('people_in_' + house.rooms.bedroom.getName());

agent.intentions.push(AlarmIntention);
agent.postSubGoal(new AlarmGoal(DaysEnum.monday, 6, 45, house.rooms.bedroom));

agent.intentions.push(SenseMovementsIntention);
agent.postSubGoal(new SenseMovementsGoal(house.people, house.rooms));

agent.intentions.push(ManageLightsIntention);
agent.postSubGoal(new ManageLightsGoal(house.rooms, 7, 23));

agent.intentions.push(ManageConsumptionIntention);
agent.postSubGoal(new ManageConsumptionGoal(house.rooms));

agent.intentions.push(ManageThermostatsIntention);
agent.postSubGoal(new ManageThermostatsGoal(house.rooms));

// Check and update temperature 
Clock.global.observe('hh', (key, hh) =>{
    if (Clock.global.hh % 2 == 0) {
        for (let [key_t, room] of Object.entries(house.rooms)) {
            if (room.devices.thermostat)
                room.devices.thermostat.updateTemperature()
        }
    }
})

// Daily schedule
Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global

    if (time.dd <= DaysEnum.friday) {
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
                return;
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