const express= require('express');
const https= require('https');
const bodyParser= require('body-parser');
const app= express();
require('dotenv').config();
const apikey= process.env.API_KEY;
app.set('view engine','ejs');
const port= 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.listen((process.env.PORT || port),()=>
{
    console.log("server is running on port "+ port);
});
var cityname="Enter city first";
var temp_ture="X";
var descrip="";
var urlimage="";
app.get("/",(req,res)=>
{
    const t_day= new Date();
    var options={
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day= t_day.toLocaleDateString("en-US",options);
    res.render("index",{city:cityname  , today: day ,temp: temp_ture,desc: descrip, url:urlimage});
});
app.post("/",(req,res)=>
{
    const city = req.body.cname;
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apikey+"&units=metric";
    https.get(url,(respose)=>
    {
        console.log(respose.statusCode);
        if(respose.statusCode==200)
        {
        respose.on("data",(data)=>
        {
            const weatherData= JSON.parse(data);
            const temperature= weatherData.main.temp;
            console.log(temperature);
            const descriptions=weatherData.weather[0].description;
            cityname=city;
            temp_ture=temperature;
            descrip=descriptions;
            const icons=weatherData.weather[0].icon;
            urlimage="https://openweathermap.org/img/wn/"+icons+"@4x.png";
            res.redirect("/");
        })}
        else
        {
            res.redirect("/");
        }

    })
})