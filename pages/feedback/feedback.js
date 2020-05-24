// pages/feedback/feedback.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    suggestimg: [],//图片组
    fontnum:0,//字数
    unclick:0,
    previewimg:0,//图片预览
    previewimgsrc:'',
    skinheight:0//屏幕高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 上传图片
   */
  addimg: function (options) {
    var that = this;
    wx.chooseImage({
      count: 5,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var arr = that.data.suggestimg;
        if (tempFilePaths.length>0){
          for (var i = 0; i < tempFilePaths.length;i++){
            if (arr.length < 5) {
              wx.uploadFile({
                url: 'https://qmzg.boc7.net/feedbackUpload', //仅为示例，非真实的接口地址
                filePath: tempFilePaths[i],
                name: 'image',
                method: 'POST',
                success: function (res) {
                  var value = JSON.parse(res.data);
                  if (value.code == 0) {
                    arr.push({ img: 'https://qmzg.boc7.net'+value.data});
                    that.setData({
                      suggestimg: arr
                    });
                  }
                }
              })
            }
          }
        }
      },
      fail:function(res){
        console.log(res);
      }
    })
  },

  /**
   * 填写内容计数
   */
  suggesttext: function (e) {
    this.setData({
      fontnum: e.detail.cursor
    });
    if(e.detail.cursor==600){
      wx.showToast({
        title: '字数超过600，请重新排版内容',
        icon:'none',
        duration:2000
      })
    }
  },

  /**
   * 提交意见
   */
  uploadsuggest: function (e) {
    var that = this;
    if (e.detail.value && !e.detail.value.textarea){
      wx.showToast({
        title: '请填写意见后再提交',
        icon: 'none',
        duration: 2000
      })
    }else{
      that.setData({
        unclick:1
      });
      setTimeout(function(){
        that.setData({
          unclick: 0
        });
      },30000);
      wx.request({
        url: 'https://qmzg.boc7.net/feedback',
        method: 'post',
        data: { 
          'formid': e.detail.formId, 
          'wx_number': e.detail.value.input1,
          'content': e.detail.value.textarea,
          'image': that.data.suggestimg
        },
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              suggestimg: []
            });
          }
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  previewsuggestimg: function (e) {
    var that = this;
    if (e.currentTarget.dataset){
      wx.getSystemInfo({
        success: function (res) {
          var skinheight = (res.windowHeight - (res.windowWidth / 750) * 94 + 13) + "px";
          that.setData({
            skinheight: skinheight,
            previewimg: 1,//图片预览
            previewimgsrc: e.currentTarget.dataset.imgsrc
          });
        }
      })//获取屏幕高度设置排行榜高度
    }
  },

  /**
   * 关闭预览图片
   */
  closemask: function () {
    this.setData({
      previewimg: 0
    })
  },

  /**
   * 删除预览图片
   */
  deleimg: function (e) {
    var that = this;
    var arr = [];
    for (var i=0;i<that.data.suggestimg.length;i++){
      if (that.data.previewimgsrc!=that.data.suggestimg[i].img){
        arr.push(that.data.suggestimg[i]);
      }
    }
    that.setData({
      previewimg: 0,
      suggestimg:arr
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