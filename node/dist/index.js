"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const FILEPATH = path_1.default.resolve(`${__dirname}/../../sites.txt`);
const file = fs_1.default.readFileSync(FILEPATH);
const sites = file.toString().split('\n');
async function startBenchmark() {
    console.time("benchmark");
    const calls = sites.map(getSiteStatusCode);
    const responses = await Promise.allSettled(calls).then(data => data).catch(error => error);
    return responses.map((response) => response.value).filter(Boolean);
}
function endBenchmark(results) {
    console.log(`${results.length} sites`);
    console.timeEnd("benchmark");
    process.exit(0);
}
async function getSiteStatusCode(site) {
    console.time(site);
    const response = await axios_1.default.get(`https://${site}`);
    console.timeEnd(site);
    console.log(`${response.status} ${response.statusText}`);
    return { site, statusCode: response.status };
}
startBenchmark().then(endBenchmark).catch(console.error);
