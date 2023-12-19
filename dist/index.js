"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const app = (0, express_1.default)();
exports.app = app;
const PORT = (0, config_1.default)().port;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
function onStart() {
    console.log(`Server running on port ${PORT}`);
}
app.listen(PORT, onStart);
