const Team = require('../models/Team');
const Project = require('../models/Project');
const User = require('../models/User');

module.exports = {
    createTeamGet: (req, res) => {
        res.render('adminStuff/createTeam');
    },

    createTeamPost: (req, res) => {
        const {
            teamName
        } = req.body;
        Team.create({
                name: teamName
            })
            .then((e) => {
                res.redirect('/');
            })
            .catch((err) => {
                consolelog(err);
            });
    },

    createProjectGet: (req, res) => {
        res.render('adminStuff/createProject');
    },

    createProjectPost: (req, res) => {
        const {
            projectName,
            description
        } = req.body;
        Project.create({
                name: projectName,
                description,
            })
            .then((e) => {
                res.redirect('/');
            })
            .catch((err) => {
                console.log(err);
            });
    },

    projectsAdmin: async (req, res) => {

        try {

            let teams = await Team.find({});
            let projects = [];

            await Project.find({}).then((pr) => {

                pr.forEach(element => {
                    if (!element.team) {
                        projects.push(element);
                    }
                });

            }).catch((err) => {
                console.log(err);
            });

            res.render('adminStuff/projects', {
                teams,
                projects
            });

        } catch (err) {
            console.log(err);
        };

    },
    
    manageTeams: async (req, res) => {
        try {
            const {
                team,
                project
            } = req.body;

            let teamI = await Team.findById(team);
            let projectI = await Project.findById(project);

            projectI.team = team;
            teamI.projects.push(project);

            await projectI.save();
            await teamI.save();
            res.redirect('/');

        } catch (err) {
            console.log(err);
        };

    },

    teamsAdmin: async (req, res) => {
        try {

            let users = await User.find({});
            let teams = await Team.find({});

            res.render('adminStuff/teams', {
                users,
                teams
            });

        } catch (err) {
            console.log(err);
        };

    },
    //Distibute button to make
    manageUsers: async(req, res) => {
        try {
             const { user, team } = req.body;

            
            let userI = await User.findById(user);
            let teamI = await Team.findById(team);

          

            for (const pers of teamI.members) {
                console.log(pers);
                if(pers === userI._id) {
                    return console.error = 'User is already in the team';
                }
            }

            teamI.members.push(userI._id);
            userI.teams.push(teamI._id);
            
            await userI.save();
            await teamI.save();
            res.redirect('/');

        } catch (err) {
            console.log(err);
        };
    },



};