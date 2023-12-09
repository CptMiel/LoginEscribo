const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

/* 
 * Usuário Rotas
 */

router.get('/', loginController.homepage);
router.get('/paineldecontrole', loginController.painelpage);
//router.get('/paineldecontrole', loginController.demoAdmin);
router.get('/addAdmin', loginController.addAdminpage);
router.post('/addAdmin', loginController.postAdmin);
router.post('/login', loginController.loginUser);
router.get('/view/:id', loginController.viewUser);
router.get('/edit/:id', loginController.editUser);
//router.put('/edit/:id', loginController.editPostUser);
router.post('/buscar', loginController.searchUser);

module.exports = router;