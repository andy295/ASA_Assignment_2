
const house =  require('../../Classes/House');
const GlobalUtility = require('../../Utilities/GlobalUtilities');
const vacuumCleanerAgents = require('./VacuumCleanerAgent');

var sensor = (agent) => (value,key,observable) => {

    for (let vacuumCleanerAgent of vacuumCleanerAgents) {
        if (agent.name == vacuumCleanerAgent.getName()) {

            let updateBeliefs = false;
            let statement = [] = key.split(' ');

            switch(statement[0]) {
                case 'is_room':
                case 'dirty':
                    if (agent.getOperationLevel() == 
                        house.getRoom(statement[1]).getLevel())
                        updateBeliefs = true;
                break;
                case 'clean':
                    if (agent.getOperationLevel() == 
                        house.getRoom(statement[1]).getLevel()) {
                        if(value)
                            house.getRoom(statement[1]).setClean(true);
                        
                        updateBeliefs = true;
                    }
                break;
                case 'connected':
                    if (house.getRoom(statement[1]).getLevel() == 
                        house.getRoom(statement[2]).getLevel() &&
                        agent.getOperationLevel() == 
                        house.getRoom(statement[1]).getLevel())
                       updateBeliefs = true;
                break;
                case 'is_robot':
                    if (agent.name == statement[1]) {
                        key = statement[0];
                        updateBeliefs = true;
                    }
                break;
                case 'in':
                    if (agent.name == statement[1] && value) {
                        key = statement[0] + ' ' + statement[2];

                        const deviceLocation = agent.getDevice().getLocation(); 
                        if (deviceLocation != statement[2]) {

                            const roomFrom = house.getRoom(deviceLocation); 
                            const roomTo = house.getRoom(statement[2]);
                            const devName = agent.getDevice().getName(); 
                            if (GlobalUtility.isValidObj(roomTo) &&
                                GlobalUtility.isValidObj(roomFrom)) {
                                if (roomFrom.moveDeviceTo(devName, roomTo))
                                    agent.setDevice(roomTo.getDevice(devName));
                            }
                        }

                        updateBeliefs = true;
                    }
                break;
                default:
                break; 
            }

            if (updateBeliefs)
                value ? agent.beliefs.declare(key) : agent.beliefs.undeclare(key);
        }
    }
}

module.exports = sensor;