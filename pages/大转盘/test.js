// pages/test/test.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var animation = wx.createAnimation({
      duration: 8000, 
      timingFunction: 'ease-in'
    });
    this.animation = animation;
    animation.rotate(180).step({ duration: 500, timingFunction: 'linear'});
    animation.rotate(180 * 2).step({ duration: 400, timingFunction: 'linear' });
    animation.rotate(180 * 3).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 4).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 5).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 6).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 7).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 8).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 9).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 10).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 11).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 12).step({ duration: 300, timingFunction: 'linear' });
    animation.rotate(180 * 13).step({ duration: 300, timingFunction: 'linear' });
    this.setData({
      animationData: animation.export()
    });
    setTimeout(function () {
      animation.rotate(180 * 14).step({ duration: 400, timingFunction: 'linear' });
      animation.rotate(180 * 15).step({ duration: 500, timingFunction: 'linear' });
      animation.rotate(180 * 16).step({ duration: 600, timingFunction: 'linear' });
      animation.rotate(180 * 17).step({ duration: 700, timingFunction: 'linear' });
      animation.rotate(180 * 18).step({ duration: 800, timingFunction: 'ease-out' });
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 4200)
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