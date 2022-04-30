const House =  require('./House')
const Agent = require('../bdi/Agent')
const Clock =  require('../utils/Clock');
const {AlarmGoal, AlarmIntention} = require('./Alarm')
const {SenseMovementsGoal, SenseMovementsIntention} = require('./MovementSensor')
const {ManageLightsGoal, ManageLightsIntention} = require('./LightManager')
const {DaysEnum, MonthsEnum} = require('./Calendar')

// House, which includes people, rooms and devices
var house = new House();


// Agents
var agent = new Agent('house_agent');
agent.intentions.push(AlarmIntention);
agent.postSubGoal(new AlarmGoal(DaysEnum.monday, 6, 45, house.rooms.bedroom));

agent.intentions.push(SenseMovementsIntention);
agent.postSubGoal(new SenseMovementsGoal(house.people, house.rooms));

agent.intentions.push(ManageLightsIntention);
agent.postSubGoal(new ManageLightsGoal(house.rooms));

// house.people.Ashley.moveTo('living_room');


// Daily schedule
Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    
    switch (time.dd) {
        case DaysEnum.monday:
            {
                // if (time.hh == 12 && time.mm == 0)
                //     house.people.Ashley.moveTo('living_room');
            }
            break;
        case DaysEnum.tuesday:
            {
                // if (time.hh == 15 && time.mm == 30)
                //     house.people.Adam.moveTo('living_room');    
            }
            break;
        case DaysEnum.wednesday:
            {
                // if (time.hh == 19 && time.mm == 0)
                //     house.people.Adam.moveTo('bedroom');
            }
            break;
        case DaysEnum.thursday:
            {
                // if(time.hh == 20 && time.mm == 15)
                //     house.people.Ashley.moveTo('entrance');
       
            }
            break;
        case DaysEnum.friday:
            {
                
            }
            break;
        case DaysEnum.saturday:
            {
                
            }
            break;
        case DaysEnum.sunday:
            {
                
            }
            break;
        default:
            {
                Clock.stopTimer();
                return;
            }
    }
})

// Start clock
Clock.startTimer();
