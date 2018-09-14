/*页面适配*/
function screen() {
    let width = $(window).width();
    let height = $(window).height();
    let heightProportion = height/1080;
    $(".ft72").css("fontSize",72*heightProportion + 'px');
    $(".ft20").css("fontSize",20*heightProportion + 'px');
    $(".ft14").css("fontSize",14*heightProportion + 'px');
    $(".ft30").css("fontSize",30*heightProportion + 'px');
    $(".ft18").css("fontSize",18*heightProportion + 'px');
    $(".h150").css("height",150*heightProportion + 'px');
    $(".h180").css("height",180*heightProportion + 'px');
    $(".h250").css("height",250*heightProportion + 'px');
    $(".h270").css("height",270*heightProportion + 'px');
    $(".h230").css("height",230*heightProportion + 'px');
    $(".top25").css("top",25*heightProportion + 'px');
    $(".top260").css("top",260*heightProportion + 'px');
    $(".top280").css("top",280*heightProportion + 'px');
    $(".top300").css("top",300*heightProportion + 'px');
    $(".top350").css("top",350*heightProportion + 'px');
    $(".top540").css("top",540*heightProportion + 'px');
    $(".top490").css("top",490*heightProportion + 'px');
    $(".top510").css("top",510*heightProportion + 'px');
    $(".top660").css("top",660*heightProportion + 'px');
    $(".top735").css("top",735*heightProportion + 'px');
    $(".first-background").css("height",282*heightProportion + 'px');
    $(".fourth-background").css("height",990*heightProportion + 'px');
    $(".third-background").css("height",592*heightProportion + 'px');
    $(".mgt10").css("marginTop",10*heightProportion + 'px');
    $(".mgt15").css("marginTop",15*heightProportion + 'px');
    $(".mgt30").css("marginTop",30*heightProportion + 'px');
    $(".mgt20").css("marginTop",20*heightProportion + 'px');
    $(".mgt45").css("marginTop",45*heightProportion + 'px');
    $(".mgb30").css("marginBottom",30*heightProportion + 'px');
    $(".mgt-25").css("marginTop",-(25*heightProportion) + 'px');
    $(".mgt-54").css("marginTop",-(54*heightProportion) + 'px');
    $(".mgt-100").css("marginTop",-(100*heightProportion) + 'px');
    $(".mgt-118").css("marginTop",-(118*heightProportion) + 'px');
    $(".mgt-140").css("marginTop",-(140*heightProportion) + 'px');
    $(".mgt5").css("marginTop",5*heightProportion + 'px');
    $(".header").css("height",74*heightProportion + 'px');
    $(".bg").css("height",1080*heightProportion + 'px');
}
setTimeout(function () {
    for (let i=0;i<$(".title h4").length;i++) {
        let productWidth = $($(".title .product")[i]).width();
        let hrWidth = $($(".title")[i]).width() - $($(".title h4")[i]).width() - productWidth -20
        $($(".title hr")[i]).css("width", hrWidth);
        console.log(productWidth)
    }
},500)
$(window).resize(function () {
    screen();
})
screen();

const common = {
    getData (type,data,func){
        if (type==='POST'){
            $.ajax({
                type: type,
                url: "/api/common/api",
                dataType: 'json',
                headers:{
                    'TOKEN': 'bigScreen',
                    "Accept": "application/json",
                },
                data: data,
                contentType: "application/json",
                error: function (err) {
                    //请求失败时被调用的函数
                    console.log("传输失败:" + JSON.stringify(err));
                },
                success: function (data) {
                    func(data);
                }
            });
        }else {
            $.ajax({
                type: type,
                url: "/api/common/api/"+ data,
                headers:{
                    'TOKEN': 'bigScreen',
                    "Accept": "application/json",
                },
                contentType: "application/json",
                dataType: 'json',
                error: function (err) {
                    //请求失败时被调用的函数
                    console.log("传输失败:" + JSON.stringify(err));
                },
                success: function (data) {
                    func(data);
                }
            });
        }

    },
    weatherIcon:{
        '中雨':'images/moderateRain.svg',
        '多云':'images/cloudy.svg',
        '多云转晴':'images/cloudy.svg',
        '大雨':'images/heavyRain.svg',
        '小雨':'images/lightRain.svg',
        '小雪':'images/lightSnow.svg',
        '扬沙':'images/blowingSand.svg',
        '晴':'images/sunny.svg',
        '阴':'images/overcast.svg',
        '阵雨':'images/shower.svg',
        '阵雪':'images/snowShower.svg',
        '雨夹雪':'images/sleet.svg',
        '霾':'images/smog.svg',
        '雾':'images/fog.svg',
        '小雨转多云':'images/lightRain.svg',
        '多云转小雨':'images/cloudy.svg',
        '阴转小雨':'images/overcast.svg',
        '小雨转阴':'images/lightRain.svg',
        '晴转多云':'images/sunny.svg',
        '多云转晴':'images/cloudy.svg',
    },
    deepCopy (sourceObj,targetObj={}){
        for(var name in sourceObj){
            if(typeof sourceObj[name] === "object"){
                targetObj[name]= (sourceObj[name].constructor===Array)?[]:{};
                this.deepCopy(sourceObj[name],targetObj[name]);
            }else{
                targetObj[name]=sourceObj[name];
            }
        }
        return targetObj;
    }
}



