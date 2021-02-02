import express from 'express';

export const server = (port:number, app:express.Express):void => {
    app.listen(port, () => {
        console.log(`app is listening on port ${port}`);
    });
};

export default server;