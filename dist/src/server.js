"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// @ Parsing requests and more
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
// @ for .env variables
const dotenv_1 = __importDefault(require("dotenv"));
// @ Express
const express_1 = __importDefault(require("express"));
// @ DB
const mongoose_1 = __importDefault(require("mongoose"));
// @ Swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// @ Routes
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const file_route_1 = __importDefault(require("./routes/file_route"));
// import { jestSHIT } from './utils/constants';
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.unsubscribe((0, cookie_parser_1.default)());
if (process.env.NODE_ENV == 'test') {
    dotenv_1.default.config({ path: './.testenv' });
}
else {
    dotenv_1.default.config();
}
mongoose_1.default.connect(process.env.DATABASE_URL); //,{useNewUrlParser:true})
const db = mongoose_1.default.connection;
db.on('error', error => { console.error(error); });
db.once('open', () => { console.log('connected to mongo DB'); });
app.use('/public', express_1.default.static('public'));
app.use('/uploads', express_1.default.static('uploads'));
app.use('/auth', auth_route_1.default);
app.use('/post', post_route_1.default);
app.use('/user', user_route_1.default);
app.use('/file', file_route_1.default);
if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000", },],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
}
module.exports = server;
//# sourceMappingURL=server.js.map