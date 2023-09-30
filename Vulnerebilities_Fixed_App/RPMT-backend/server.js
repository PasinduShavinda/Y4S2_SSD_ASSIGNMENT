require('dotenv').config();
const express = require("express");
const cors = require("cors");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Google OAuth..................................

const session = require("express-session");
const MongoConnect = require('connect-mongo');
const passport = require("passport");
const logger = require("./utils/logger");
const g_auth_routes = require("./routes/g_login_route");
const { dbconnect } = require("./utils/database.connection");
const { googleAuth } =  require("./configs/google.auth");
const config = require("./configs");

// ...............................................

const router1 = require("./routes/shv_res_topic_routes");
const router2 = require("./routes/shv_res_topic_notice_admin_routes");
const router3 = require("./routes/shv_rs_topic_file_routes");
const router4 = require("./routes/shv_ResDocfileRoutes");
const router5 = require("./routes/shv_ThesisDocfileRoutes");
const router6 = require("./routes/shv_res_admin_mschme_routes");
const router7 = require("./routes/shv_res_admin_template_routes");
const router8 = require("./routes/sug_panel-routes");
const router9 = require("./routes/sug_resdoc_feedback_router");
const router10 = require("./routes/sug_resdoc_feedback_router2");
const router11 = require("./routes/sug_TopicDock_Evaluvate_routes");
const router12 = require("./routes/sug_TopicDock_Evaluvate_routes2");
const router13 = require("./routes/sug_Thesis_feedback_router");
const router14 = require("./routes/sug_Thesis_feedback_router2");
const router15 = require("./routes/th_group_router");
const router16 = require("./routes/User");
const router17 = require("./routes/Supervisor");
const router18 = require("./routes/Penalmember");

const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false })

const app = express();
const PORT = process.env.PORT || "8090";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
}

// Middlewares
app.use(cors(corsOptions));
// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());
app.use(express.json());

// Google OAuth..................................

app.use(
  session({
    secret: "rpmt-secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoConnect({ mongoUrl: config.DB_CONNECTION_STRING }),
    cookie: {
      secure: false,
      expires: new Date(Date.now() + 1000000),
      maxAge: 1000000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ..................................

app.get('/getToken', csrfProtection, function (req, res) {
  res.send({csrfToken: req.csrfToken() })
});

app.listen(PORT, () => {
  logger.info(`🚀 Server is up and running on PORT ${PORT}`);
  googleAuth(passport);
  g_auth_routes(app, passport);
  app.use("/resTopics", parseForm, csrfProtection, router1);
  app.use("/resTopicsNotice", router2);
  app.use(router3);
  app.use(router4);
  app.use(router5);
  app.use(router6);
  app.use(router7);
  app.use("/panelcreate", router8);
  app.use("/resdoc_feedback", router9);
  app.use("/resdoc_feedback2", router10);
  app.use("/topicdoc_feedback", router11);
  app.use("/topicdoc_feedback2", router12);
  app.use("/thesisdoc_feedback", router13);
  app.use("/thesisdoc_feedback2", router14);
  app.use("/group", router15);
  app.use("/auth", router16);
  app.use("/super", router17);
  app.use("/penal", router18);
  dbconnect();
});
















