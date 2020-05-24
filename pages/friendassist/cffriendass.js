// pages/friendassist/friendassist.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityid: '',
    activitystar: '',
    activityend: '',
    zhugongid: 0,
    Assisted: { headimg: '', name: '' },
    redemption: [],//某用户兑换成功记录
    remaintime: { hours: 0, minutes: 0, seconds: 0 },
    remaintimestamp: 0,
    assistrank: [],//助攻排行榜记录
    // redeemed:0,//兑换人数
    friendassistcoin: 0,//助攻金额可以是自己的或者好友助攻的
    assistmannum: 9,//还缺多少人可以领宝箱
    masklayer: true,//遮罩层默认关闭
    eventtype: 0,//遮罩层内容类型，默认无，1为领取及分享点击事件，2为分享好友成功，3为活动规则
    boxshow: true,//宝箱提示默认隐藏
    viewBg1: 0,
    viewBg2: 0,
    viewBg3: 0,
    reachmoney1: '',
    reachmoney2: '',
    reachmoney3: '',
    hashelps: 0,//好友进来助攻默认是0
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // sharebigimg: '',
    hastoken: 0,//是否授权
    gamelist: [],
    loginCode: 0,//登录logincode
    timeinterval: {},
    loadingHidden: false,
    circlegoods: []//商品广告
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var token = wx.getStorageSync('token');
    if (!token) {
      token = '';
    }
    var data = { token: token, active_id: options.id, zg_id: options.zg_id };//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/v6_helpInfo',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0 && value.data.hasActive == 1) {
          value.data.active.start_time = app.timestr(value.data.active.start_time, 'year');
          value.data.active.end_time = app.timestr(value.data.active.end_time, 'year');
          that.setData({
            gamelist: value.data.advertise.length > 0 ? value.data.advertise : [],
            Assisted: { headimg: value.data.user.headimg, name: value.data.user.nickname },
            redemption: value.data.exchange,
            activitystar: value.data.active.start_time,
            activityend: value.data.active.end_time,
            hashelps: token ? value.data.user.hasHelp : 0,
            friendassistcoin: token ? value.data.user.help_money : 0.00,
            circlegoods: value.data.circle_goods,
            zhugongid: options.zg_id,
            hastoken: token?1:0,
            activityid: options.id,
            loadingHidden: true
          });
          console.log(that.data);

          if (value.data.time !== undefined) {
            //活动剩余时间
            var hours = parseInt(value.data.time / 3600);
            var minutes = parseInt((value.data.time % 3600) / 60);
            var seconds = parseInt((value.data.time % 3600) % 60);
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            that.setData({
              remaintime: { hours: hours, minutes: minutes, seconds: seconds },
              remaintimestamp: value.data.time
            });
          }

          if (value.data.totalMoney < 6) {
            that.setData({
              viewBg1: '50%',
              viewBg2: '0%',
              viewBg3: '0%'
            });
          } else if (value.data.totalMoney > 6 && value.data.totalMoney < 68) {
            that.setData({
              viewBg1: '100%',
              viewBg2: '50%',
              viewBg3: '0%',
              reachmoney1: 'color:#261C0B;background:#fff',
              giftname: value.data.goods.flexGoods[0]
            });
          } else if (value.data.totalMoney > 68 && value.data.totalMoney < 408) {
            that.setData({
              viewBg1: '100%',
              viewBg2: '100%',
              viewBg3: '50%',
              reachmoney2: 'color:#261C0B;background:#fff',
              giftname: value.data.goods.flexGoods[1]
            });
          } else if (value.data.totalMoney > 408) {
            that.setData({
              viewBg1: '100%',
              viewBg2: '100%',
              viewBg3: '100%',
              reachmoney3: 'color:#261C0B;background:#fff',
              giftname: value.data.goods.flexGoods[2]
            });
          }

          if (value.data.totalHelp !== undefined || value.data.totalMoney !== undefined) {
            if ((parseInt(value.data.totalHelp) == 1) || (parseInt(value.data.totalHelp) == 10 && value.data.prize_count == 1) || (parseInt(value.data.totalHelp) == 19 && value.data.prize_count == 2) || (parseInt(value.data.totalHelp) == 28 && value.data.prize_count == 3)) {
              that.setData({
                assistmannum: 9
              });
            } else {
              that.setData({
                assistmannum: 9 - (parseInt(value.data.totalHelp) - 1) % 9
              });
            }
          }
          if (value.data.helps !== undefined) {
            for (var i = 0; i < value.data.helps.length; i++) {
              value.data.helps[i].ctime = app.timestr(value.data.helps[i].ctime, 'month');
            };
            that.setData({
              assistrank: value.data.helps
            });
          }
        }
        if (value.code == 0 && value.data.hasActive == 0) {//助攻不存在或已经结束
          that.setData({
            masklayer: !that.data.masklayer,
            eventtype: 5,
            circlegoods: value.data.circle_goods,
            loadingHidden: true
          })
        }
        if (value.code == 472) {//活动已经结束
          that.setData({
            masklayer: !that.data.masklayer,
            eventtype: 7,
            circlegoods: value.data.circle_goods,
            loadingHidden: true
          })
        }
        if (value.code == 301 || value.code == 302 || value.code == 303) {
          wx.login({
            success: function (login) {
              if (login.code) {
                that.setData({
                  loginCode: login.code
                });
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          });
          that.setData({
            masklayer: !that.data.masklayer,
            eventtype: 6,
            loadingHidden: true
          });
        }
      },
      fail: function (res) {
        console.log('获取兑奖信息失败');
      }
    });
    var timeinterval = setInterval(function () {
      if (that.data.remaintimestamp > 0) {
        that.data.remaintimestamp = that.data.remaintimestamp - 1;
        var hours = parseInt(that.data.remaintimestamp / 3600);
        var minutes = parseInt((that.data.remaintimestamp % 3600) / 60);
        var seconds = parseInt((that.data.remaintimestamp % 3600) % 60);
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        that.setData({
          remaintime: { hours: hours, minutes: minutes, seconds: seconds },
          remaintimestamp: that.data.remaintimestamp
        });
      }
    }, 1000);
    that.setData({
      timeinterval: timeinterval
    });
  },

  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.encryptedData) {
      if (that.options && that.options.zg_id > 0) {
        var active = { id: that.options.id, active_name: '穿越火线', zg_id: that.options.zg_id };
        app.requesttoken(that.data.loginCode, e.detail, active);
      }
    }
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
   * 助攻结束跳首页
   */
  jumpindex: function (e) {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  /**
   * 为好友助攻
   */
  AssistingFriends: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = { token: token, zg_id: that.data.zhugongid };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/help',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 1,
              friendassistcoin: value.data.money,
              hashelps: 1
            });
            var addassist = that.data.assistrank;//好友助攻成功后助攻记录添加一次
            addassist.unshift({ headimg: value.data.headimg, nickname: value.data.nickname, money: value.data.money, ctime: value.data.month + '-' + value.data.day });
            that.setData({
              assistrank: addassist
            });
          }
          if (value.code == 470) {
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 5
            });
          }//助攻已经结束
          if (value.code == 472) {
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 7
            })
          }//活动已经结束
          if (value.code == 473) {
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 4
            });
          }//助攻机会不足
        },
        fail: function (res) {
          console.log('助攻失败');
        }
      });
    } else {
      wx.login({
        success: function (login) {
          if (login.code) {
            console.log('获取code', login.code);
            that.setData({
              loginCode: login.code
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
      that.setData({
        masklayer: !that.data.masklayer,
        eventtype: 6
      });
    }
  },

  /**
   * 自己发起助攻
   */
  assistgift: function (e) {
    var that = this;
    wx.redirectTo({
      url: '/pages/myselfassist/cfassist?id=' + that.data.activityid,
    });
  },

  /**
   * 跳转客服页面回复1
   */
  replyone: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      eventtype: 8
    })
  },

  /**
   * 阅读规则
   */
  rule: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      eventtype: 3
    })
  },

  /**
   * 点击宝箱显示
   */
  boxtip: function (e) {
    var that = this;
    that.setData({
      boxshow: false
    });
    setTimeout(function () {
      that.setData({
        boxshow: true
      });
    }, 2000);
  },

  /**
   * 点击跳转链接
   */
  jumpapplet: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wxe5d6fb5f83c474d4',
      path: 'pages/index/index?appkey=17b64a5be8b7d0d2647a7c82a782432e&adSpaceKey=0121eab3f653898a1c41292337d28cd5',
      extraData: {},
      envVersion: 'release',
      success(res) {
        console.log('成功打开小程序');
      }
    });
  },

  /**
   * 点击进入游戏
   */
  clickgame: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.gamelist[index].type == 1) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [that.data.gamelist[index].location_big_img] // 需要预览的图片http链接列表
      });
    } else {
      setTimeout(function () {
        var token = wx.getStorageSync('token');
        if (token) {
          var frontback = app.globaldata.gametime;
          var interval = 0;//记录玩游戏的时间
          var setintervalone = setInterval(function () {
            frontback = app.globaldata.gametime;
            interval += 1;
            if (interval >= 20) {
              clearInterval(setintervalone);
              var data = { token: token, game_id: that.data.gamelist[index].id };//token字符串转成对象
              data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
              wx.request({
                url: 'https://qmzg.boc7.net/addHelpChange',
                method: 'post',
                data: { data: data },//字符串转成json对象
                success: function (res) {
                  var value = app.decrypt(res.data);
                  wx.showToast({
                    title: value.msg,
                    icon: 'none',
                    duration: 2000
                  });
                },
                fail: function (res) {
                  console.log('添加积分失败');
                }
              });
            } else {
              if (frontback == 1) {
                clearInterval(setintervalone);
                wx.showToast({
                  title: '需要停留20秒，才算试玩成功哦~',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          }, 1000);
        };
      }, 5000);
    }
  },

  /**
     * 跳抽奖
     */
  randomlottery: function (e) {
    var token = wx.getStorageSync('token');
    var that = this;
    if (token) {
      wx.navigateTo({
        url: '/pages/moneybag/moneybag'
      });
    } else {
      wx.login({
        success: function (login) {
          if (login.code) {
            console.log('获取code', login.code);
            that.setData({
              loginCode: login.code
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
      that.setData({
        masklayer: !that.data.masklayer,
        eventtype: 6
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
    clearInterval(this.data.timeinterval);
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '点一下，你和TA都能获得CF手游角色和钻石奖励！',
      path: 'pages/index/index',
      desc: '',
      imageUrl: 'https://qmzgcdn.boc7.net/test/cf_share.jpg'
    }
  }
})