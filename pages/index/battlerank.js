// pages/makebattle/battlerank.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skinheight: '',//助攻栏高度
    ranknum: { '0': 'https://qmzgcdn.boc7.net/test/serial_number1.jpg', '1': 'https://qmzgcdn.boc7.net/test/serial_number2.jpg', '2': 'https://qmzgcdn.boc7.net/test/serial_number3.jpg' },
    day: [],
    week: [],
    color: 0,
    hastoken: 0,//是否授权
    userid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var data;//token字符串转成对象
    if (!token) {
      token = '';
    }
    data = app.encrypt(JSON.stringify({ token: token }));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/integrateIndex',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        if (value.code == 0) {
          that.setData({
            userid: token?value.data.uid:'',
            hastoken: token ?1:0,
            day: token ?value.data.friends_ranking:[],
            week: value.data.nation_ranking
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
      }, fail: function (res) {
        console.log('获取战力榜信息失败');
      }
    });
  },

  /**
   * 用户切换排行榜
   */
  change_color: function (e) {
    this.setData({
      color: e.currentTarget.dataset.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      day: [],
      week: [],
      hastoken: 0,//是否授权
      userid: ''
    })
    this.onLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    if (that.data.userid) {//已经加密
      return {
        title: '【有人@你】点一下，助攻领红包啦！',
        path: 'pages/index/index?userid=' + that.data.userid,
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/test/index_share3.jpg'
      }
    } else {//未登录状态分享
      return {
        title: '【有人@你】点一下，助攻领红包啦！',
        path: 'pages/index/index',
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/test/index_share3.jpg'
      }
    }
  }
})