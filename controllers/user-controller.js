const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Project = require('../models/Project');
const Team = require('../models/Team');

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                roles: ['User'],
                profilePicture: reqUser.profilePicture,
                teams: [],
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register');
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({
                username: reqUser.username
            });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
    },

    profile: async (req, res) => {
        let user = req.user;

        User.findById(user._id).populate({
                path: 'teams',
                populate: {
                    path: 'projects'
                }
            })
            .then((user) => {
                let teams = [];
                let projects = [];

                for (let team of user.teams) {
                    teams.push(team);
                    for (let project of team.projects) {
                        projects.push(project);
                    }
                }

                res.render('users/profile', {
                    user,
                    teams,
                    projects
                })
            });


    },

    removeFromTeam: (req, res) => {
        let teamId = req.params.id;
        let user = req.user
        console.log(teamId);


    },

    projectsUser: async (req, res) => {
        try {

            await Project.find({}).populate('team')
                .then((projects) => {

                    res.render('users/projects', {
                        projects
                    });
                })
                .catch((err) => {
                    console.log(err);
                });


        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },

    teamsUser: async (req, res) => {

        try {
            let teams = await Team.find().populate([{
                path: 'members',
                model: 'User'
            }, {
                path: 'projects',
                model: 'Project'
            }]).exec(function (err, teams) {
                if (err) throw err;
                res.render('users/teams', {
                    teams
                });
            });

        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },

    projectSearch: (req, res) => {
        const query = req.query.query;

        Project.find({})
            .then((projects) => {
                const filteredProjects = projects.filter((a) => {
                    return a.name.toLowerCase().includes(query.toLowerCase());
                });
                const context = {
                    query: query,
                    projects: filteredProjects
                };

                res.render('users/projects', context);
            })
            .catch(console.error);

    },

    teamSearch: async (req, res) => {
        try {
            const query = req.query.query;

            await Team.find({})
                .then((teams) => {

                    const filteredTeams = teams.filter((a) => {
                        return a.name.toLowerCase().includes(query.toLowerCase());
                    });


                    const context = {
                        query: query,
                        teams: filteredTeams
                    };

                    res.render('users/teams', context);
                })

                .catch(console.error);

        } catch (error) {
            console.log(error);
        }

    },

};