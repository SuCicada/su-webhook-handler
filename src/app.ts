import express from "express";

import logger from "morgan";
import indexRouter from "./routes/index";
// import usersRouter from "./routes/users";

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/webhook', indexRouter);
// app.use('/users', usersRouter);

app.listen(41404, () => {
    console.log('Server is running');
})
// module.exports = app;