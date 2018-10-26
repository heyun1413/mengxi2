/**
 * router 简单实现
 */
/**
 * 创建路由器
 * @constructor
 */
function Router($) {
    this.routes = {};
    this.$ = $;
    this.currentUrl = '';
}

/**
 * 创建路由
 * @param path
 * @param callback
 */
Router.prototype.route = function (path, callback) {
    this.routes[path] = callback || function () {};
};

/**
 * 通过路径根性界面
 * @param url
 */
Router.prototype.updateView = function (url) {
    if (this.currentUrl !== url) {
        this.currentUrl = url;
        location.hash = url;
        this.routes[url] && this.routes[url](url);
    }
};
/**
 * 将链接绑定到路由
 */
Router.prototype.bindLink = function () {
    var that = this;
    this.$('a[data-href]').click(function (e) {
        e.preventDefault();
        that.updateView(e.target.getAttribute('data-href'));
    });
};
/**
 * 初始化操作
 */
Router.prototype.init = function () {
    this.bindLink();
    var that = this;
    var addEvent = window.addEventListener || window.attachEvent;
    addEvent('hashchange', function() {
        console.log(location.hash);
        that.updateView(location.hash);
    });
    this.$(document).ready(function () {
        that.updateView(location.hash);
    });
};