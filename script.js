const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// const loadingContainer = document.querySelector('.loading-container');
const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');
//initially variables need??
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();//agr phle se coordinate diya ho
//switcTab fxn
function switchTab(newTab){

    if(newTab!=oldTab){//different tab hogi tbhi processing krenge 
        oldTab.classList.remove("current-tab");   //bg color hatana h
        oldTab=newTab;//
        oldTab.classList.add("current-tab"); //wapas se color lga diye
        //i don't know kis tab pe abhi h[your weather/search weather]
        //go your weather to search weather tab
        if(!searchForm.classList.contains("active")){//agar iske andar active nhi h to usko active krna h[[[koi v tab visible h to uske andar active wali class added h]]]
            //& hmne pucha kya search tab wale active class nhi h ,agar nhi h iska mtlb hme search tab wale pe  hi jana tha
            //1.grant aceess ko hata dp
            //2.user weather v remove kr do
            //3. search wale ko show kr do
            //kya search form wala container invisible,if yes then make it visible
            userInfoContainer.classList.remove("active");//invisible kr diya
            grantAccessContainer.classList.remove("active"); // "      "
            searchForm.classList.add("active");  //visible kr diya
        } 
        else{
            //search tab to your weather tab
            //main phle search tab pe tha ,ab your weather tab visible krna h
            searchForm.classList.remove("active");//hide kr diya
            userInfoContainer.classList.remove("active");//hide
            //ab main your weather tab m aagya hu,toh weather bhi display krna padega ,so let's check local storage first
            //for coordinates ,if we have saved from there
            getfromSessionStorage();//
        }
    }
}
// tab switch krne k liye
userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});
//ckecks if coordinates are already present in session storage
function getfromSessionStorage(){
    //check if coordinate are already present i session storage or not
    const localCoordinates =sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi h -->coorodinate nhi h -->to grant access wala tab
        grantAccessContainer.classList.add("active");

    }
    else{//agar local coordinate pade hue h-->use kro and 
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
//fetchUserWeatherInfo(coordinates) fan
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //1.make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //2.make loader visible
    loadingScreen.classList.add("active");
    //3.api call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
            // convert into json
            const  data = await response.json();
            if (!data.sys) {
                throw data;
            }

            //data ane k baad loader ko remove krna h
            // loader ko hta dena h
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");//visible
            renderWeatherInfo(data);//api se data ane k baad UI k upar render/dynamically values dalega

    }
    catch(err){
        loadingScreen.classList.remove("active");
        //hw
        // loadingContainer.classList.remove('active');
        notFound.classList.add('active');
        errorImage.style.display = 'block';//****
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click",myfunc);
            // fetchUserWeatherInfo();
          function myfunc(){
            notFound.classList.remove("active");
            // searchForm.classList.add('active');

          }
    }
}
function renderWeatherInfo(weatherInfo){
    //fetch elements
    // const cityName = document.querySelector("[data-cityName]");
    // const countryIcon = document.querySelector("[data-countryIcon]");
    // const desc = document.querySelector("[data-weatherDesc]");
    // const weatherIcon = document.querySelector("[data-weatherIcon]");
    // const temp = document.querySelector("[data-temp]");
    // const windspeed = document.querySelector("[data-windspeed]");
    // const humidity = document.querySelector("[data-humidity]");
    // const cloudiness = document.querySelector("[data-cloudiness]");

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);
    //fetch values from weatherINfo object and put it UI elements
    //****optional chaining op->?. -->use to fetch nested object properties
    //
    cityName.innerText=weatherInfo?.name;
    //cntry icon
    // countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText=weatherInfo?.weather?.[0]?.description;
    //weather icon
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    //temperature
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    //wind speed
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    //humidity
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    //cloudiness
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
//getlocation fxn
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw show an alert for no geolocation suppourt available
        // grant-location-container.innerHTML = "Geolocation is not supported by this browser."
    }
}
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    //storing the coordinates on session storage
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
//grant access button pe listiener lgana padega
//coordinates find krega
//usko session storage pe store krega
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();//default method ko hta deta h
    let cityName = searchInput.value;
    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
        cityName="";
});
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");//purana weather remove
    grantAccessContainer.classList.remove("active");//grant wala remove
    notFound.classList.remove("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();//data nikalke json m convert kr liya
        if (!data.sys) {
            throw data;
        } 
        loadingScreen.classList.remove("active");//ab loader ko hta do
        userInfoContainer.classList.add("active");//weather dikhana h ab
        renderWeatherInfo(data);//UI pe show weather
    }
    catch(err) {
        //hW
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "block";///****** 
        errorBtn.addEventListener("click",errRemove);   
        function errRemove(){
            notFound.classList.remove("active");  
          }
    }
}