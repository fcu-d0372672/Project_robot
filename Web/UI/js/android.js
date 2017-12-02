var GOOGLE_STATUS = 0;
let speckContent = "";

function AndroidPlanPath(info) {
    let lat, lng;
    let location = info.dataset.loc
    location = location.split(',')

    lat = location[0];
    lng = location[1];
    console.log(lat)
    console.log(lng)
    try {
        if (JSInterface) {
            JSInterface.setDirection(lat, lng);
            NavigationSpeck(info.dataset.type, info.dataset.id);
        }
    } catch (e) {
        if (e instanceof ReferenceError) {
            console.log("Plan Path: " + info.dataset.type + info.dataset.id)
            NavigationSpeck(info.dataset.type, info.dataset.id);
        } else {
            printError(e, false);
        }
    }
}

function OpenURL(url) {
    try {
        if (JSInterface) {
            JSInterface.sendWebviewURL(url);
        }
    } catch (e) {
        if (e instanceof ReferenceError) {
            var win = window.open(url, '_blank');
            win.focus();
        } else {
            printError(e, false);
        }
    }
}

function GoolgeMap() {
    if (JSInterface) {
        if (GOOGLE_STATUS == 0) {
            JSInterface.showToast();
            GOOGLE_STATUS = 1;
        }
    }
}

function CloseMap() {
    GOOGLE_STATUS = 0;
}

function GetHistoryAndSpeak(URL, id) {
    URL = URL + id
    fetch(URL, {
        method: 'GET',
    }).then(function (response) {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }).then(function (data) {
        InitSpeech(data)
        // data 才是實際的 JSON 資料
    }).catch(function (error) {
        return error.response;
    }).then(function (errorData) {
        // errorData 裡面才是實際的 JSON 資料
    });
}

function NavigationSpeck(type, id) { //Android Webview need call this function to speech
    let url;
    if (type == 'college') url = COLLEGE_DIALOG_URL;
    else if (type == 'building') url = BUILDING_DIALOG_URL;
    else if (type == 'landscape') url = LANDSCAPE_DIALOG_URL;

    console.log(type)
    console.log(id)
    GetHistoryAndSpeak(url, id)
}

function InitSpeech(data) {
    if (data.info.history)
        speakContent = data.info.history;
    else
        speakContent = data.info.introduction;

    speakContent = speakContent.split('\n')[0].replace(' ', '').replace('\n', ',').replace('。', ',').replace('、', ',')
    console.log("Get Text" + speakContent)

    try {
        if (JSInterface) {
            JSInterface.setTTS(speakContent);
        }
    } catch (e) {
        if (e instanceof ReferenceError) {
            Speech(speakContent)
        } else {
            printError(e, false);
        }
    }
}
