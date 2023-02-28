"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const server_1 = __importDefault(require("./server"));
const socket_server_1 = __importDefault(require("./socket_server"));
server_1.default.listen(process.env.PORT || 3000, () => __awaiter(void 0, void 0, void 0, function* () {
    (0, socket_server_1.default)(server_1.default);
    console.log('Server started on port: ', process.env.PORT);
}));
module.exports = server_1.default;
//# sourceMappingURL=app.js.map