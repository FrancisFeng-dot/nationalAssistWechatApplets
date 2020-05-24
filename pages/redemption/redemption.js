// pages/redemption/redemption.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    datalist:[],
    hasexchange:false//默认兑换记录空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if(token){
      var data = { token: token };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/exchangeInfo',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            if (value.data.length > 0) {
              for (var i = 0; i < value.data.length; i++) {
                value.data[i]['tip'] = value.data[i].is_send == 0 ? value.data[i]['remark'] : (value.data[i].send_type == 1 ? '礼品已发送' : (value.data[i].send_type == 2 ? '礼品已折合成现金充值到余额，请到个人中心->收益记录查看':''));
                value.data[i].ctime = app.timestr(value.data[i].ctime, 'year');
              };
            }
            that.setData({
              hasexchange: value.data.length > 0?true:false,
              datalist: value.data
            });
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
          console.log('获取兑奖信息失败');
        }
      });
    } else {
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
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
  
  }
})