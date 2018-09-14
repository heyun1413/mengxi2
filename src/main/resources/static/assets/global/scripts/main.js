function CustomMap(options) {

    var defualt = {
        lng:106.7876866400,
        lat:39.8297760400,
        mapId:"allmap",
        zIndex:9999999,
        zoom:10,
        resizeEnable:true,
        longitude:0,
        latitude:0,
        title:'',
        position:''
    }
    this.options =$.extend(defualt,options);
    this.current_lng='';
    this.current_lat='';
}

CustomMap.prototype.createPoint=function(){
    var map = new AMap.Map(this.options.mapId,{
        resizeEnable: this.options.resizeEnable,
        zoom: this.options.zoom,
        center: [this.options.lng, this.options.lat]
    });
    var marker = new AMap.Marker({
        position: [this.options.lng, this.options.lat],
        title: this.options.title,
        zIndex: this.options.zIndex
    });
    var title = this.options.title;
    var position = this.options.position;
    var self = this;
    if(this.options.latitude!="0"){
        marker.setMap(map);
        self.loadInfoWindow(map,marker,title,position);
    }
    var clickEventListener = map.on('click', function(e) {
        map.remove(marker);
        self.current_lng = e.lnglat.getLng();
        self.current_lat = e.lnglat.getLat();
        marker = new AMap.Marker({
            position: [self.current_lng, self.current_lat],
            title: self.options.title,
            zIndex: self.options.zIndex
        });
        marker.setMap(map);
        self.loadInfoWindow(map,marker,title,position);
    });

}

CustomMap.prototype.editPoint=function(){
    var map = new AMap.Map(this.options.mapId,{
        resizeEnable: this.options.resizeEnable,
        zoom: this.options.zoom,
        center: [this.options.longitude, this.options.latitude]
    });
    var marker = new AMap.Marker({
        position: [this.options.longitude, this.options.latitude],
        title: this.options.title,
        zIndex: this.options.zIndex
    });
    var title = this.options.title;
    var position = this.options.position;
    marker.setMap(map);
    var self = this;
    self.loadInfoWindow(map,marker,title,position);
    var clickEventListener = map.on('click', function(e) {
        map.remove(marker);
        self.current_lng = e.lnglat.getLng();
        self.current_lat = e.lnglat.getLat();
        marker = new AMap.Marker({
            position: [self.current_lng, self.current_lat],
            title: self.options.title,
            zIndex: self.options.zIndex
        });
        marker.setMap(map);
        self.loadInfoWindow(map,marker,title,position);
    });
}

CustomMap.prototype.viewPoint=function(){
    var map = new AMap.Map(this.options.mapId,{
        resizeEnable: this.options.resizeEnable,
        zoom: this.options.zoom,
        center: [this.options.longitude, this.options.latitude]
    });
    var marker = new AMap.Marker({
        position: [this.options.longitude, this.options.latitude],
        title: this.options.title,
        zIndex: this.options.zIndex
    });
    var title = this.options.title;
    var position = this.options.position;
    marker.setMap(map);
    var self = this;
    self.loadInfoWindow(map,marker,title,position);
}

CustomMap.prototype.loadInfoWindow=function(map,marker,title,position) {
    AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
        var infoWindow = new SimpleInfoWindow({
            infoTitle: '<strong>'+title+'</strong>',
            infoBody: '<p class="my-desc"><strong>位置：'+position+'</strong></p>',
            offset: new AMap.Pixel(0, -31)
        });
        infoWindow.open(map, marker.getPosition());
    });
}