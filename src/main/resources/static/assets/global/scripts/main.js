function CustomMap(options) {
    this.options =$.extend({
        lng: 106.7876866400,
        lat: 39.8297760400,
        mapId: "map",
        zIndex: 9999999,
        zoom: 10,
        resizeEnable: true,
        longitude: 0,
        latitude: 0,
        position: '',
        title: '123'
    }, options);
    this.current_lat = this.options.latitude;
    this.current_lng = this.options.longitude;
}

CustomMap.prototype.getTitle = function () {
    return this.current_lat && this.current_lng ? this.current_lat + ',' + this.current_lng : '';
}

CustomMap.prototype.showTip = function (map) {
    if (this.marker) {
        map.remove(this.marker);
    }
    if (!this.current_lat || !this.current_lng) {
        return;
    }
    var title = this.getTitle();
    this.marker = new AMap.Marker({
        position: [this.current_lng, this.current_lat],
        zIndex: this.options.zIndex
    });
    this.marker.setMap(map);
    this.loadInfoWindow(map, this.marker, title, this.options.position);
}

CustomMap.prototype.editPoint=function(){
    var map = new AMap.Map(this.options.mapId,{
        resizeEnable: this.options.resizeEnable,
        zoom: this.options.zoom,
        center: [this.options.lng, this.options.lat]
    });
    // this.showTip(map);
    var self = this;
    map.on('click', function(e) {
        self.current_lng = e.lnglat.getLng();
        self.current_lat = e.lnglat.getLat();
        self.showTip(map);
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
            infoBody: '',
            offset: new AMap.Pixel(0, -31)
        });
        infoWindow.open(map, marker.getPosition());
    });
}