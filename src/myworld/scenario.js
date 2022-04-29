const House =  require('./house')
const Logger =  require('./logger')
const Agent = require('../bdi/Agent')
const Clock =  require('../utils/Clock');
const {AlarmGoal, AlarmIntention} = require('./Alarm')
const {SenseMovementsGoal, SenseMovementsIntention} = require('./MovementSensor')

// Days of week
const Monday = 0;
const Thuesday = 1;
const Wednesday = 2;
const Thursday = 3;
const Friday = 4;
const Saturday = 5;
const Sunday = 6;

// House, which includes people, rooms and devices
var house = new House();

// Agents
var agent = new Agent('house_agent');
agent.intentions.push(AlarmIntention);
agent.postSubGoal(new AlarmGoal(6, 45));

agent.intentions.push(SenseMovementsIntention);
agent.postSubGoal(new SenseMovementsGoal([house.people.Adam, house.people.Ashley], house.rooms));

// Daily schedule
Clock.global.observe('mm', (key, mm) => {
    var time = Clock.global
    
    switch (time.dd) {
        case Monday:
            {
                if (time.hh == 12 && time.mm == 0)
                    house.people.Ashley.moveTo('living_room');
        
            }
            break;
        case Thuesday:
            {
                if (time.hh == 15 && time.mm == 30)
                    house.people.Adam.moveTo('living_room');    
            }
            break;
        case Wednesday:
            {
                if (time.hh == 19 && time.mm == 0)
                    house.people.Adam.moveTo('bedroom');
            }
            break;
        case Thursday:
            {
                if(time.hh == 20 && time.mm == 15)
                    house.people.Ashley.moveTo('entrance');
       
            }
            break;
        case Friday:
            {
                
            }
            break;
        case Saturday:
            {
                
            }
            break;
        case Sunday:
            {
                
            }
            break;
    }
})

// Start clock
Clock.startTimer();