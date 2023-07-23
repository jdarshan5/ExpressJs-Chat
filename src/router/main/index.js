import { Router } from "express";

const MainRouter = Router();

MainRouter.use('', (req, res) => {
    res.sendFile('/src/html/index.html', { root: '.' });
});

export default MainRouter;