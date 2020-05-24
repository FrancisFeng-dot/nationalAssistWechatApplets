// pages/moneybag/moneybag.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    eventtype: 0,//弹框事件类型
    turnbale_eventtype: 0,//转盘抽奖弹框
    hastoken: 0,//是否登录
    userid: '',//加密过的用户id
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gift1: {},
    gift2: {},
    gift3: {},
    gift4: {},
    gift5: {},
    gift6: {},
    gift7: {},
    gift8: {},
    Frequent_clicks: 0,//预防频繁点击
    redemption: [],//某用户兑换成功记录
    playresult: 2,//试玩游戏的结果
    goodsdetail: [],
    mybattle: 0,
    mymoney: 0,
    game_battle: 0,
    remaindraws: 1,//只要是大于0就可以，为了启动立即抽奖的遮罩
    winproinfo: '',//抽中奖的商品的信息
    gamedetail: {},//抽中奖获得的游戏奖励
    getmoney: 0,//试玩游戏后获得金钱
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if(!token){
      token = '';//token字符串转成对象
    }
    var data = app.encrypt(JSON.stringify({ token: token }));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/v7_circleLotteryGoods',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
            that.setData({
              redemption: value.data.exchange,
              goodsdetail: value.data.goods,
              mybattle: token?value.data.integrate:0,
              remaindraws: token ? value.data.integrate : 1,
              mymoney: token ? value.data.money:0.00,
              hastoken: token ? 1:0,
              userid: token ? value.data.uid : '',
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
        console.log('获取抽奖活动失败');
      }
    })
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
   * 抽奖
   */
  randomlottery: function (e) {
    var token = wx.getStorageSync('token');
    var that = this;
    if (token) {
      that.setData({
        Frequent_clicks: 1//预防频繁点击
      });
      setTimeout(function () {
        that.setData({
          Frequent_clicks: 0//预防频繁点击
        });
      }, 3000);
      if (that.data.mybattle < 100) {
        console.log(1);
        console.log(that.data.mybattle);
        that.setData({
          masklayer: !that.data.masklayer,
          eventtype: 2
        });
      } else {
        console.log(2);
        console.log(that.data.mybattle);
        var data = { token: token };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/v9_circleLottery',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value.data);
            if (value.code == 0) {
              var giftscale1 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale2 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale3 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale4 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale5 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale6 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale7 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              var giftscale8 = wx.createAnimation({
                duration: 50,
                timingFunction: 'ease',
              });
              giftscale1.scale(1.08, 1.08).step();
              giftscale1.scale(1, 1).step();
              giftscale2.scale(1.08, 1.08).step({ delay: 100 });
              giftscale2.scale(1, 1).step();
              giftscale3.scale(1.08, 1.08).step({ delay: 200 });
              giftscale3.scale(1, 1).step();
              giftscale4.scale(1.08, 1.08).step({ delay: 300 });
              giftscale4.scale(1, 1).step();
              giftscale5.scale(1.08, 1.08).step({ delay: 400 });
              giftscale5.scale(1, 1).step();
              giftscale6.scale(1.08, 1.08).step({ delay: 500 });
              giftscale6.scale(1, 1).step();
              giftscale7.scale(1.08, 1.08).step({ delay: 600 });
              giftscale7.scale(1, 1).step();
              giftscale8.scale(1.08, 1.08).step({ delay: 700 });
              giftscale8.scale(1, 1).step();
              giftscale1.scale(1.08, 1.08).step({ delay: 700 });
              giftscale1.scale(1, 1).step();
              giftscale2.scale(1.08, 1.08).step({ delay: 700 });
              giftscale2.scale(1, 1).step();
              giftscale3.scale(1.08, 1.08).step({ delay: 700 });
              giftscale3.scale(1, 1).step();
              giftscale4.scale(1.08, 1.08).step({ delay: 700 });
              giftscale4.scale(1, 1).step();
              giftscale5.scale(1.08, 1.08).step({ delay: 700 });
              giftscale5.scale(1, 1).step();
              giftscale6.scale(1.08, 1.08).step({ delay: 700 });
              giftscale6.scale(1, 1).step();
              giftscale7.scale(1.08, 1.08).step({ delay: 700 });
              giftscale7.scale(1, 1).step();
              giftscale8.scale(1.08, 1.08).step({ delay: 700 });
              giftscale8.scale(1, 1).step();
              giftscale1.scale(1.08, 1.08).step({ delay: 700 });
              giftscale1.scale(1, 1).step();
              giftscale2.scale(1.08, 1.08).step({ delay: 700 });
              giftscale2.scale(1, 1).step();
              giftscale3.scale(1.08, 1.08).step({ delay: 700 });
              giftscale3.scale(1, 1).step();
              giftscale4.scale(1.08, 1.08).step({ delay: 700 });
              giftscale4.scale(1, 1).step();
              giftscale5.scale(1.08, 1.08).step({ delay: 700 });
              giftscale5.scale(1, 1).step();
              giftscale6.scale(1.08, 1.08).step({ delay: 700 });
              giftscale6.scale(1, 1).step();
              giftscale7.scale(1.08, 1.08).step({ delay: 700 });
              giftscale7.scale(1, 1).step();
              giftscale8.scale(1.08, 1.08).step({ delay: 700 });
              giftscale8.scale(1, 1).step();
              that.setData({
                gift1: giftscale1.export(),
                gift2: giftscale2.export(),
                gift3: giftscale3.export(),
                gift4: giftscale4.export(),
                gift5: giftscale5.export(),
                gift6: giftscale6.export(),
                gift7: giftscale7.export(),
                gift8: giftscale8.export(),
              });
              setTimeout(function () {
                for (var i = 0; i < that.data.goodsdetail.length; i++) {
                  if (that.data.goodsdetail[i].id == value.data.goods_id) {
                    var prizeinfo = that.data.goodsdetail[i];
                  }
                }
                if (prizeinfo.get_way == 5 || prizeinfo.get_way == 10) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    remaindraws: that.data.mybattle - 100,
                    mybattle: that.data.mybattle - 100,
                    eventtype: 4,
                    turnbale_eventtype: 3,
                    mymoney: (parseFloat(that.data.mymoney) + parseFloat(value.data.money)).toFixed(2),
                    winproinfo: prizeinfo.get_way == 5 ? prizeinfo.goods_name : prizeinfo.goods_name + value.data.money + '元'
                  });//红包
                } else if (prizeinfo.get_way == 6) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    eventtype: 4,
                    turnbale_eventtype: 2,
                    remaindraws: that.data.mybattle + value.data.integrate - 100,
                    mybattle: that.data.mybattle + value.data.integrate - 100
                  })//战力
                } else if (prizeinfo.get_way == 7) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    remaindraws: that.data.mybattle - 100,
                    mybattle: that.data.mybattle - 100,
                    eventtype: 3
                  })//未中奖
                } else if (prizeinfo.get_way == 8) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    remaindraws: that.data.mybattle - 100,
                    mybattle: that.data.mybattle - 100,
                    eventtype: 4,
                    turnbale_eventtype: 6
                  })//任务红包
                } else if (prizeinfo.get_way == 9) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    remaindraws: that.data.mybattle - 100,
                    mybattle: that.data.mybattle - 100,
                    eventtype: 4,
                    turnbale_eventtype: 4,
                    gamedetail: value.data.game
                  })//玩游戏获取
                } else if (prizeinfo.get_way == 12 && value.data.game.type == 0) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    remaindraws: that.data.mybattle - 100,
                    mybattle: that.data.mybattle - 100,
                    eventtype: 4,
                    turnbale_eventtype: 7,
                    gamedetail: value.data.game
                  })//小程序
                } else if (prizeinfo.get_way == 12 && value.data.game.type == 2) {
                  value.data.game.game_url = escape(value.data.game.game_url);
                  that.setData({
                    masklayer: !that.data.masklayer,
                    remaindraws: that.data.mybattle - 100,
                    mybattle: that.data.mybattle - 100,
                    eventtype: 4,
                    turnbale_eventtype: 8,
                    gamedetail: value.data.game
                  })//平安意外险或者其他h5链接
                } else if (prizeinfo.get_way == 12 && value.data.game.type == 3) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    remaindraws: that.data.mybattle - 100,
                    mybattle: that.data.mybattle - 100,
                    eventtype: 4,
                    turnbale_eventtype: 9,
                    gamedetail: value.data.game
                  })//回复客服消息进入h5链接
                }
              }, 2600);
            } else if (value.code == 450) {
              that.setData({
                masklayer: !that.data.masklayer,
                eventtype: 2
              });
            } else if (value.code == 302) {
              try {
                wx.clearStorageSync();
                wx.redirectTo({
                  url: '/pages/login/login'
                })
              } catch (e) {
                console.log('Do something when catch error');
              }
            } else {
              wx.showToast({
                title: value.msg,
                icon: 'none',
                duration: 2000
              });
            }
          }, fail: function (res) {
            console.log('获取用户id失败');
          }
        });
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  /**
   * 点击进入游戏
   */
  clickgame: function (e) {
    var that = this;
    if (that.data.gamedetail.type == 1) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [that.data.gamedetail.location_big_img] // 需要预览的图片http链接列表
      })
    } else {
      setTimeout(function () {
        var token = wx.getStorageSync('token');
        if (token) {
          var frontback = app.globaldata.gametime;
          var interval = 0;//记录玩游戏的时间
          var setinterval = setInterval(function () {
            frontback = app.globaldata.gametime;
            interval += 1;
            if (interval >= 20) {
              clearInterval(setinterval);
              var data = { token: token };//token字符串转成对象
              data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
              wx.request({
                url: 'https://qmzg.boc7.net/v7_getPlayGamePrize',
                method: 'post',
                data: { data: data },//字符串转成json对象
                success: function (res) {
                  var value = app.decrypt(res.data);
                  if (value.code == 0) {
                    that.setData({
                      turnbale_eventtype: 5,
                      mymoney: (parseFloat(that.data.mymoney) + parseFloat(value.data.money)).toFixed(2),
                      getmoney: value.data.money
                    })
                  }
                },
                fail: function (res) {
                  console.log('添加积分失败');
                }
              });
            } else {
              if (frontback == 1) {
                clearInterval(setinterval);
                wx.showToast({
                  title: '体验20秒以上才能获得奖励哦',
                  icon: 'none',
                  duration: 3000
                });
              }
            }
          }, 1000);
        }
      }, 5000);
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
    // this.myreload();
  },

  /**
   * 刷新页面
   */
  myreload: function () {
    this.setData({
      masklayer: true,//遮罩层默认关闭
      eventtype: 0,//弹框事件类型
      turnbale_eventtype: 0,//转盘抽奖弹框
      hastoken: 0,//是否登录
      userid: '',//加密过的用户id
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      gift1: {},
      gift2: {},
      gift3: {},
      gift4: {},
      gift5: {},
      gift6: {},
      gift7: {},
      gift8: {},
      Frequent_clicks: 0,//预防频繁点击
      redemption: [],//某用户兑换成功记录
      playresult: 2,//试玩游戏的结果
      goodsdetail: [],
      mybattle: 0,
      mymoney: 0,
      game_battle: 0,
      remaindraws: 1,//只要是大于0就可以，为了启动立即抽奖的遮罩
      winproinfo: '',//抽中奖的商品的信息
      gamedetail: {},//抽中奖获得的游戏奖励
      getmoney: 0,//试玩游戏后获得金钱
      loadingHidden: false
    })
    this.onLoad();
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
    this.myreload();
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
    if (that.data.userid) {//已经加密,不符合上述两种情况，分享
      return {
        title: '【有人@你】点一下，100%中奖！iPhone、红包、游戏道具任性送~',
        path: 'pages/index/index?userid=' + that.data.userid,
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/test/moneybag_share2.jpg'
      }
    } else {//未登录状态分享
      return {
        title: '【有人@你】点一下，100%中奖！iPhone、红包、游戏道具任性送~',
        path: 'pages/index/index',
        desc: '',
        imageUrl: 'https://qmzgcdn.boc7.net/test/moneybag_share2.jpg'
      }
    }
  }
})