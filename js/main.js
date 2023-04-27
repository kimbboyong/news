
let searchInput = document.getElementById('search_input');
const searchBtn = document.getElementById('search_btn');
const menuBtn = document.querySelectorAll('.menu li a');
let news = [];
let url
let page = 1;
let total_pages = 0;


menuBtn.forEach((menu) => menu.addEventListener('click', (event) => getNewByTopic(event)))

searchInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        search(event);
    }
});


const getNews = async () => {
    try {
        let header = new Headers({
            'x-api-key': '7Cv5_jZA0wC_iO9UzI5v4CgHYs_peS0sYE33Xh2el14'
        });
        url.searchParams.set('page', page);
        console.log('url', url)
        let response = await fetch(url, { headers: header });
        let data = await response.json();
        if (response.status == 200) {
            if (data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다.");
            }
            total_pages = data.total;
            page = data.page;
            news = data.articles;
            console.log(news);
            render();
            pagenation();
        } else {
            throw new Error(data.message)
        }
    } catch (error) {
        console.log('잡힌 에러는', error.message);
        errorRender(error.message);
    }

}


const getLatestNews = async () => {
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`);

    getNews();
};

const getNewByTopic = async (event) => {
    console.log("클릭", event.target.textContent);
    let topic = event.target.textContent.toLowerCase();

    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();

    console.log("토픽뉴스", data);
}

const search = async () => {
    console.log('asd');
    let keyword = searchInput.value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    getNews();
}



const render = () => {
    let newsHtml = ''
    newsHtml = news.map(item => {
        return `
         <li>
            <figure class="left">
                <img src="${item.media}" alt="">
            </figure>
            <div class="right">
                <div class="title">
                    <h2>${item.title}</h2>
                </div>
                <div class="txt">
                    <p>${item.summary}</p>
                    <span>${item.published_date}</span>
                </div>
            </div>
        </li>
        `
    }).join('');

    document.getElementById('news').innerHTML = newsHtml;
}

const errorRender = (message) => {
    let errorHtml = `<div class="error">${message}</div>`

    document.getElementById('news').innerHTML = errorHtml;
}

const pagenation = () => {
    let pagenationHtml = '';
    let pageGroup = Math.ceil(page / 5);
    let last = pageGroup * 5;
    let first = last - 4;

    pagenationHtml = `
        <li>
            <a href="javascript:;" onclick="moveToPage(${page - 1})"> > </a>
        </li>
    `

    for (let i = first; i <= last; i++) {
        pagenationHtml += `
               <li class="${page == i ? "active" : ''}">
                    <a href="javascript:;" onclick="moveToPage(${i})">${i}</a>
                </li>
        `
    }

    pagenationHtml += `
        <li>
            <a href="javascript:;"  onclick="moveToPage(${page + 1})"> > </a>
        </li>   
    `

    document.getElementById('page_wrap').innerHTML = pagenationHtml;
}

const moveToPage = (pageNum) => {
    //1 이동하고싶은 페이지를 알아야함
    page = pageNum;
    //2 이동하고싶은 페이지를 가지고 api 다시 호출
    getNews();
}

searchBtn.addEventListener('click', search);
getLatestNews();