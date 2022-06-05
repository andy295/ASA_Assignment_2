const pddlActionIntention = require('../../../pddl/actions/pddlActionIntention');
const houseAgent = require('../House/HouseAgent');


class Move extends pddlActionIntention {
    static parameters = ['from', 'to'];

    static precondition = [
        ['is_room', 'from'],
        ['is_room', 'to'],
        ['connected', 'from', 'to'],
        ['in', 'from'],
        ['is_robot'] ];

    static effect = [ ['in', 'to'], ['not in', 'from'] ];

    *exec ({from, to}=parameters) {
        yield houseAgent.move({
            robot: this.agent.name,
            from: from,
            to: to})
    }
}

class Clean extends pddlActionIntention {
    static parameters = ['room'];

    static precondition = [ ['is_room', 'room'],
        ['dirty', 'room'],
        ['in', 'room'],
        ['is_robot'] ];

    static effect = [ ['clean', 'room'], ['not dirty', 'room'] ];

    *exec ({room}=parameters) {
        yield houseAgent.clean({
            robot: this.agent.name,
            room: room,
            actionTime: this.agent.cleanTime[room]})
    }
}

module.exports = {Move, Clean}