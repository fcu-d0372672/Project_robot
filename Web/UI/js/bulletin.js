const BULLETIN_URL = 'http://localhost:3000/api/fcu/bulletin';
const bulletin = {
    paragraph: ['校園新聞', '校園公告', '校園活動', '校園演講'],
    type: ['News', 'Announce', 'Activity', 'Lecture']
}

const iconList = [
    'fa fa-newspaper-o',
    'fa fa-bullhorn',
    'fa fa-users',
    'fa fa-file-text-o'
];

var bulletinList = JSON.parse('{}');
var titleList = {
    News: [],
    Announce: [],
    Activity: [],
    Lecture: []
}

function AddBuletinList(bulletinList) {
    /*************************Loader prepend to tag:body*************************/
    let titleHtml = []
    var col = '<div class="col-10 col-xl-10 rounded"></div>';
    $('#inner_bg').prepend(col);
    var row = '<div id="bulletin_list" class="row"></div>';
    $('#inner_bg').append(row);

    for (let i = 0; i < 4; i++) {
        for (let y = 0; y < 5; y++) {
            titleList[bulletin.type[i]].push(
                // '<p class="card-title"><a href="SendWebviewURL(' + bulletinList[bulletin.type[i]][y]['url'] + ')">'
                // + bulletinList[bulletin.type[i]][y]['title'] + '</p>'
                '<p class="card-title"><a href="javascript:SendWebviewURL(\'' + bulletinList[bulletin.type[i]][y]['url'] + '\')">' +
                bulletinList[bulletin.type[i]][y]['title'] + '</p>'
            )
        }
        titleHtml.push(
            titleList[bulletin.type[i]][0] +
            titleList[bulletin.type[i]][1] +
            titleList[bulletin.type[i]][2] +
            titleList[bulletin.type[i]][3]
        )
    }
    console.log(bulletinList['Carousel'])
    AddCarousel(bulletinList['Carousel']);
    /*************************Insert the card*************************/
    for (let i = 0; i < bulletin.paragraph.length; i++) {
        $('<div class="col-md-12 col-xl-6 mb-4">' +
            '<div class="card h-100 message_container">' +
            '<div class="card-header">' +
            '<a class="bulletin_title_icon">' +
            bulletin.paragraph[i] +
            '<span class="' + iconList[i] + ' float-right float-md-right"></span>' +
            '</a>' +
            '</div>' +
            '<div class="card-body">' +
            titleHtml[i] +
            '</div>' +
            '<div class="card-footer d-flex justify-content-end ftr">' +
            '<button class="btn btn-outline-secondary button_rwd">More..</button>' +
            '</div>' +
            '</div>' +
            '</div>').appendTo('#bulletin_list');
    }
}

function AddCarousel(imgList) {
    let carousel_inner =
        '<div class="carousel slide" id="carouselExampleControls_mainpage" data-ride="carousel">' +
        '<div id="carousel_item" class="carousel-inner d-md-flex d-sm-flex d-lg-flex justify-content-center rounded">' +
        '<ul class="carousel-indicators"></ul>' +
        '</div>' +
        '</div>';

    let carouselControlIcon =
        '<a class="carousel-control-prev" href="#carouselExampleControls_mainpage" role="button" data-slide="prev">' +
        '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '<a class="carousel-control-next" href="#carouselExampleControls_mainpage" role="button" data-slide="next">' +
        '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
        '<span class="sr-only">Next</span>' +
        '</a>'

    $('#inner_bg').prepend(carousel_inner);

    /*************************Isert the carousel item*************************/
    for (let i = 0; i < imgList.length; i++) {
        $('<div class="carousel-item item_container">' +
            '<div class="d-md-flex d-sm-flex d-lg-flex h-100 align-items-center justify-content-center">' +
            '<img class="d-block img-fluid carousel_img" src=" ' +
            imgList[i]['image'] +
            '"></div></div>').appendTo('#carousel_item');

        $('<li class="" data-target="#photoCarousel" data-slide-to="' + i + '"></li>').appendTo('.carousel-indicators');
    }

    $('#carousel_item').append(carouselControlIcon)
    $('.carousel-item.item_container').first().addClass('active');
    $('.carousel-indicators > li').first().addClass('active');
    $('#carousel').carousel();
}

function getBulletin() {
    fetch(BULLETIN_URL, {
        method: 'GET',
    }).then(function(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }).then(function(data) {
        var bulletinList = data;
        AddBuletinList(bulletinList);
        // data 才是實際的 JSON 資料
    }).catch(function(error) {
        return error.response;
    }).then(function(errorData) {
        // errorData 裡面才是實際的 JSON 資料
    });
}

function SendWebviewURL(url) {
    console.log(url)
    if (JSInterface) {
        JSInterface.sendWebviewURL(url);
    }
}

function GoolgeMap() {
    if (JSInterface) {
        JSInterface.showToast();
    }
}

function test() {
    getBulletin();
}