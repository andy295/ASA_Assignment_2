# Autonomous Software Agents - Laboratory

University of Trento - Trento, 2022

## Changelog

### 1.0 (01/05/2022)

- Implemented scenario with alarm, movement sensors, lights and thermostats managers; 

## Project structure

The project aims to implement a home automation solution. It relays on [Autonode.js](https://github.com/marcorobol/Autonode.js) framework, which has been (and will be) expanded with everitything necessary to define the house and its elements.  

**src/myWorld** folder contains all the core of the project and it is composed as following:

- **./src/myWorld/Scenario.js** - this file contains the entry point, run this file in order to start the simulation.

- **./src/myWorld/Classes** - all the definitions of the classes used to represent the elements and the residents of the house, as well as the house itself, are containded here.

- **./src/myWorld/Classes/house_config** - the house configuration relays on *.json* files, this folder contains that files.

- **./src/myWorld/Goals_Intentions** - everything related to the agent's goals and intentions are stored here. Each file contains a goal and an intention.

- **./src/myWorld/Utilities** - the folder contains some useful files that help to better represent the environment from different points of view.

- **./simulation.log** - this file contains traces of an execution of the simulation.

## Description
The scenario performs a week in the house, describing the habits of its residents and the decisions taken by the agent.

Into the **Scenario.js** file it is possible to find the week schedule that defines the behaviour of the residents. Based on that, the agent can take its decision, for exampler it can turn on the light of a room if there is some one inside, and turn off the light when the room is left. For simplicity lights can be turned on between 7 and 23.

In addition, every two hours the temperature of every room is updated, by randomly generate a new temperature value. Again, the agent evaluates the temperature and decides if it is necessary to turn on or off the climate control system.

For simplicity not all the agents and devices have been implemented.

Indeed what is possible to find in the current release are four devices:

* alarm clock
* motion sensors
* lights
* thermostat

However, the first two don't have a real object implementation, the reasons behind this chooice are basically two. First, for what concern the motion sensors, the devices used for the motion detection are passive devices. The residents cannot actively interact with them, but those are simply interfaces used by the agent in ordert to understand what is happening into the house. Second, regarding the alarm clock, the agent can perform this goal by using what is in its possession (audio speaker, etc.). It makes no sense to define a class for the alarm clock.

For the second two devices instead, it is possible to find their implementation into the **Device.js** file, with all their methods and members. Every device inherits from a base class **Device** and then it is expandend in order to better reflects its own characteristics.

The whole is comleted by the presence of two residents, and one agent, that is the House Agent.

More details about the entire environment can be found [here](https://github.com/andy295/Autonomous_Software_Agent_Project/blob/main/Environment%20description.pdf).