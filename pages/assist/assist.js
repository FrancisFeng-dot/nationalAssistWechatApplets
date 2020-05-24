// pages/assist/assist.js
//获取应用实例
const app = getApp();
Page({
  data: {
    speaknotify:[],
    actives: [],
    color:0,
    day: [],
    week: [],
    ranknum: { '0': 'https://qmzgcdn.boc7.net/test/serial_number1.jpg','1': 'https://qmzgcdn.boc7.net/test/serial_number2.jpg', '2':'https://qmzgcdn.boc7.net/test/serial_number3.jpg'},
    skinheight: '',//助攻栏高度
    loadingHidden: false,
    notifytype:1
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://qmzg.boc7.net/v7_activeIndex',
      method: 'post',
      data: {},//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          //var datearr = value.data.actives;
          // for (var i = 0; i < value.data.actives.length; i++) {
          //   datearr[i].startdate = app.datestr(datearr[i].start_time);
          //   datearr[i].enddate = app.datestr(datearr[i].end_time);
          // }
          that.setData({
            loadingHidden: true,
            actives: value.data.actives,
            speaknotify: value.data.exchanges,
            day: value.data.dayHelps,
            week: value.data.weekHelps
          });
          wx.getSystemInfo({
            success: function (res) {
              var skinheight = (res.windowHeight - (res.windowWidth / 750) * 94 + 13) + "px";
              that.setData({
                skinheight: skinheight
              });
            }
          });//获取屏幕高度设置排行榜高度
        } else {
          try {
            wx.clearStorageSync();
            wx.redirectTo({
              url: '/pages/login/login'
            })
          } catch (e) {
            console.log('Do something when catch error');
          }
        }
      },
      fail: function (res) {
        console.log('获取首页信息失败');
      }
    });
  },

  change_color: function (e) {
    this.setData({
      color: e.currentTarget.dataset.type
    })
  },

  /**
     * 监听用户刷新
     */
  onPullDownRefresh: function (res) {
    this.setData({
      actives: [],
      color: 0,
      day: [],
      week: [],
      loadingHidden: false
    })
    this.onLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  }
})
