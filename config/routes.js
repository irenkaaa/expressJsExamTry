const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/register', restrictedPages.isAnonymous, controllers.user.registerPost);
    app.post('/logout', restrictedPages.isAuthed, controllers.user.logout);
    app.get('/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/login', restrictedPages.isAnonymous, controllers.user.loginPost);
    app.get('/profile/:id', restrictedPages.isAuthed, controllers.user.profile);
    app.post('/profile/:id', restrictedPages.isAuthed, controllers.user.removeFromTeam); //не е вярно

    app.get('/projects', restrictedPages.isAuthed, controllers.user.projectsUser);
    app.get('/teams', restrictedPages.isAuthed, controllers.user.teamsUser);
    app.get('/project/search', restrictedPages.isAuthed, controllers.user.projectSearch);
    app.get('/team/search', restrictedPages.isAuthed, controllers.user.teamSearch);

    app.get('/create/team', restrictedPages.hasRole('Admin'), controllers.admin.createTeamGet);
    app.post('/create/team', restrictedPages.hasRole('Admin'), controllers.admin.createTeamPost);
    app.get('/create/project', restrictedPages.hasRole('Admin'), controllers.admin.createProjectGet);
    app.post('/create/project', restrictedPages.hasRole('Admin'), controllers.admin.createProjectPost);
    app.get('/admin/projects', restrictedPages.hasRole('Admin'), controllers.admin.projectsAdmin);
    app.get('/admin/teams', restrictedPages.hasRole('Admin'), controllers.admin.teamsAdmin);

    app.post('/admin/projects', restrictedPages.hasRole('Admin'), controllers.admin.manageTeams );
    app.post('/admin/teams', restrictedPages.hasRole('Admin'), controllers.admin.manageUsers );


    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};