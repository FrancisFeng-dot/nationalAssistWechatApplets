// pages/more/more.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    box: [],
    activebanner: [],
    //gamelist: [],
    masklayer: true,//遮罩层默认关闭
    contactparams: '',//访问客服界面的参数
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if(!token){
      token = '';
    }
    var data = {token:token};//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/gameIndex',
      method: 'post',
      data: {data:data},//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            box: value.data.game,
            //gamelist:value.data.h5,
            activebanner: value.data.banner,
            loadingHidden: true
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
        console.log('获取游戏失败');
      }
    });
  },

  /**
   * 用户关闭弹框
   */
  closemask: function (e) {
    this.setData({
      masklayer: !this.data.masklayer
    })
  },

  /**
   * 跳转客服页面回复1
   */
  replyone: function (e) {
    if (e.currentTarget.dataset) {
      this.setData({
        masklayer: !this.data.masklayer,
        contactparams: e.currentTarget.dataset.params
      })
    }
  },

  /**
   * 点击跳转链接
   */
  jumpapplet: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var opentype = e.currentTarget.dataset.type;
    if (opentype == 'box'){
      if (that.data.box[index].type == 1) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [that.data.box[index].location_big_img] // 需要预览的图片http链接列表
        })
      }
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
    this.setData({
      box: [],
      activebanner: [],
      loadingHidden: false
      //gamelist: []
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

  }
})