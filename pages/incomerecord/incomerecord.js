// pages/incomerecord/incomerecord.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    incomerecord: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = { token: token };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/moneyLog',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            var arr = value.data;
            if (value.data.length > 0) {
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].money > 0) {
                  arr[i].color = 1;
                } else {
                  arr[i].color = 0;
                }
              }
            }
            that.setData({
              incomerecord: arr
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
          console.log('获取积分情况失败');
        }
      });
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