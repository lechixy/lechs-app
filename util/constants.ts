import * as path from 'path';

export default {
    "appName": "lechsapp",
    "appVersion": "0.1.0",
    "appURL": "https://lechixy.netlify.app",
    "appTestURL": "http:/localhost:3000",
    getIcon: () => {
        return path.join(__dirname, '../../res/favicon.ico');
    }
}