// pages/myselfassist/myselfassist.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityid: '',
    activitystar: '',
    activityend: '',
    redemption: [],//某用户兑换成功记录
    remaintime: { hours: 0, minutes: 0, seconds: 0 },
    remaintimestamp: 0,//活动剩余总秒数
    hasreceive: { num: '0', money: '0' },//获得的助攻次数及金额
    assistrank: [],//助攻排行榜记录
    friendassistcoin: 0,//助攻金额可以是自己的或者好友助攻的
    assistmannum: 9,//还缺多少人可以领宝箱
    masklayer: true,//遮罩层默认关闭
    eventtype: 0,//遮罩层内容类型，默认无，1为领取及分享点击事件，2为分享好友成功，3为开第一个宝箱结果，4为兑换信息，5为活动规则
    assisttype: 1,//默认无，1为用户自己点击发起事件，2为点击领取事件
    condition: 0,//宝箱兑换条件，1为不满足，2为是否兑换，3为兑换成功，4为已经兑换过
    boxshow: true,//宝箱提示默认隐藏
    viewBg1: 0,
    viewBg2: 0,
    viewBg3: 0,
    reachmoney1: '',
    reachmoney2: '',
    reachmoney3: '',
    giftname: { id: -1, goods_name: '', money: '' },
    discountmoney: 0,//折扣价
    buffertime: '',//兑换成功后距离下次发起的时间
    boxexchange: 3,//获得宝箱奖励的状态，0未获得，1获奖，2获积分，3抽奖已3次提示
    boxgiftmsg: '',//获得宝箱奖励的内容
    exchangetype: 1,//1为领取礼物兑换，2为宝箱抽奖兑换
    zg_id: '',//用户为好友发送的助攻的id
    submitswitch: 1,//随机赋值没有任何意义，为了在第一时间将提交按钮变为不可点击
    hastoken: 0,//是否授权
    gamelist: [],
    buttonlock: 0,//随机的时间没有任何意义，为了在第一时间将助攻按钮变为分享按钮，之后会重新对该值赋值，不会对原来的代码有影响
    userid: '',//加密后的用户id
    rate: 0,//兑换金额利率
    noshownotice: 0,//是否显示订阅主题弹框
    timeinterval: {},
    loadingHidden: false,
    circlegoods: []//商品广告
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var data;
    if (token) {
      data = { token: token, active_id: options.id };//token字符串转成对象
    } else {
      data = { token: '', active_id: options.id };//token字符串转成对象
    }
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/v6_helpInfo',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        if (value.code == 0) {
          value.data.active.start_time = app.timestr(value.data.active.start_time, 'year');
          value.data.active.end_time = app.timestr(value.data.active.end_time, 'year');
          that.setData({
            gamelist: value.data.advertise.length > 0 ? value.data.advertise : [],
            redemption: value.data.exchange,
            activitystar: value.data.active.start_time,
            activityend: value.data.active.end_time,
            rate: value.data.rate,
            circlegoods: value.data.circle_goods,
            userid: token ? value.data.uid : '',
            zg_id: token && value.data.hasActive == 1 ? value.data.user.zg_id : 0,
            timeinterval: token ? setInterval(function () {
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
            }, 1000) : {},
            hastoken: token ? 1 : 0,
            activityid: options.id,
            loadingHidden: true
          });

          if (token) {
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
              if (value.data.time > 0) {
                that.setData({
                  buttonlock: 1//随机的时间没有任何意义，为了在第一时间将助攻按钮变为分享按钮，之后会重新对该值赋值，不会对原来的代码有影响
                });
              } else {
                that.setData({
                  buttonlock: 0//随机的时间没有任何意义，为了在第一时间将助攻按钮变为分享按钮，之后会重新对该值赋值，不会对原来的代码有影响
                });
              }
            }

            if (value.data.totalMoney < 8) {
              that.setData({
                viewBg1: '50%',
                viewBg2: '0%',
                viewBg3: '0%',
                condition: 1
              });
            } else if (value.data.totalMoney > 8 && value.data.totalMoney < 28) {
              that.setData({
                viewBg1: '100%',
                viewBg2: '50%',
                viewBg3: '0%',
                reachmoney1: 'color:#1C6D6E;background:#fff',
                giftname: value.data.goods.flexGoods[0],
                condition: 2
              });
            } else if (value.data.totalMoney > 28 && value.data.totalMoney < 50) {
              that.setData({
                viewBg1: '100%',
                viewBg2: '100%',
                viewBg3: '50%',
                reachmoney2: 'color:#1C6D6E;background:#fff',
                giftname: value.data.goods.flexGoods[1],
                condition: 2
              });
            } else if (value.data.totalMoney > 50) {
              that.setData({
                viewBg1: '100%',
                viewBg2: '100%',
                viewBg3: '100%',
                reachmoney3: 'color:#1C6D6E;background:#fff',
                giftname: value.data.goods.flexGoods[2],
                condition: 2
              });
            }

            if (value.data.totalHelp !== undefined || value.data.totalMoney !== undefined) {
              that.setData({
                hasreceive: { num: value.data.totalHelp, money: value.data.totalMoney }
              });
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
   * 用户关闭弹框
   */
  closemask: function (e) {
    this.setData({
      masklayer: !this.data.masklayer
    });
    if (e.currentTarget.dataset && e.currentTarget.dataset.notice == 'show') {
      this.setData({
        noshownotice: 1
      });
    }
  },

  /**
   * 用户发起助攻
   */
  initiateAssist: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = { token: token, active_id: that.options.id, formid: e.detail.formId };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/sendHelp',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            var hours = parseInt(value.data.time / 3600);
            var minutes = parseInt((value.data.time % 3600) / 60);
            var seconds = parseInt((value.data.time % 3600) % 60);
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 1,
              assisttype: 1,
              friendassistcoin: value.data.money,
              hasreceive: { num: 1, money: 1 },
              viewBg1: '50%',
              zg_id: value.data.zg_id,
              remaintimestamp: value.data.time,
              remaintime: { hours: hours, minutes: minutes, seconds: seconds },
              assistmannum: value.data.count,
              buttonlock: 1//随机的时间没有任何意义，为了在第一时间将助攻按钮变为分享按钮，之后会重新对该值赋值，不会对原来的代码有影响
            })
          }
          if (value.code == 484) {//礼物未领取提示
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 3,
              boxexchange: 4
            })
          }
          if (value.code == 472) {//活动已经结束提示
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 1,
              assisttype: 3
            })
          }
          if (value.code == 441) {//只能同时发起一种活动
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 1,
              assisttype: 4
            })
          } else {
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function (res) {
          console.log('发起助攻失败');
        }
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

  /**
   * 领取礼物
   */
  receivegift: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      if (that.data.condition == 1) {
        that.setData({
          masklayer: !that.data.masklayer,
          eventtype: 1,
          assisttype: 2
        });
      } else if (that.data.condition == 2) {
        var data = { token: token, active_id: that.options.id, goods_id: that.data.giftname.id };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzg.boc7.net/hasChange',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 1,
              assisttype: 2
            })
            if (value.code == 457) {
              that.setData({
                condition: 4
              });
            }
          },
          fail: function (res) {
            console.log('兑换失败');
          }
        });
      } else if (that.data.condition == 4) {
        that.setData({
          masklayer: !that.data.masklayer,
          eventtype: 1,
          assisttype: 2
        })
      }
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

  /**
   * 阅读规则
   */
  rule: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      eventtype: 5
    })
  },

  /**
   * 跳转客服页面回复1
   */
  replyone: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      eventtype: 7
    })
  },

  /**
   * 生成分享海报
   */
  generate: function (e) {
    var that = this;
    if (that.data.masklayer) {
      that.setData({
        masklayer: !that.data.masklayer,
        eventtype: 8
      });
    } else {
      that.setData({
        eventtype: 8
      });
    }
  },

  /**
   * 兑换信息提交
   */
  submitinfo: function (e) {
    var that = this;
    that.setData({
      submitswitch: 2
    })//随机赋值没有任何意义，为了在第一时间将提交按钮变为不可点击
    setTimeout(function () {
      that.setData({
        submitswitch: 1
      })//随机赋值没有任何意义，为了在第一时间将提交按钮变为可点击
    }, 6000);
    if (e.detail.value.input3.length < 5 || !parseInt(e.detail.value.input3)) {
      wx.showToast({
        title: 'QQ信息格式不正确，请重新输入',
        icon: 'none',
        duration: 2000
      })
    } else {
      var token = wx.getStorageSync('token');
      if (that.data.exchangetype == 1) {
        var data = {
          token: token,
          active_id: that.options.id,
          goods_id: that.data.giftname.id,
          wx_number: e.detail.value.input1,
          wx_nickname: e.detail.value.input2,
          qq: e.detail.value.input3,
          formid: e.detail.formId
        };//token字符串转成对象
      } else {
        var data = {
          token: token,
          active_id: that.options.id,
          wx_number: e.detail.value.input1,
          wx_nickname: e.detail.value.input2,
          qq: e.detail.value.input3,
          formid: e.detail.formId
        };//token字符串转成对象
      }
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/exchange',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            if (value.time > 0) {
              var hours = parseInt(value.time / 3600);
              var minutes = parseInt((value.time % 3600) / 60);
              var seconds = parseInt((value.time % 3600) % 60);
              var timedesc = ',' + hours + ':' + minutes + ':' + seconds + '后可以再次发起助攻';
            }
            that.setData({
              giftname: that.data.exchangetype == 2 ? { id: that.data.giftname.id, goods_name: value.goods_name, money: that.data.giftname.money } : that.data.giftname,
              buffertime: that.data.exchangetype == 2 ? '' : (value.time > 0 ? timedesc : ',立即可以再次发起助攻'),
              eventtype: 1,
              assisttype: 2,
              condition: 3
            });
          } else {
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          console.log('提交失败');
        }
      });
    }
  },

  /**
   * 点击宝箱显示
   */
  boxtip: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');//为何不判断是否剩余助攻数为0，因为情况多，只能通过访问接口判断
    if (token) {
      var data = { token: token, active_id: that.options.id };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/randExchange',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            if (value.is_get == 0) {
              that.setData({
                masklayer: !that.data.masklayer,
                eventtype: 3,
                boxexchange: 0,
                assistmannum: 9
              })
            } else if (value.is_get == 1) {
              that.setData({
                masklayer: !that.data.masklayer,
                eventtype: 3,
                boxexchange: 1,
                boxgiftmsg: value.msg,
                assistmannum: 9
              })
            }
          } else if (value.code == 480) {//已有宝箱中奖记录但未兑换
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 3,
              boxexchange: 1,
              boxgiftmsg: value.msg
            })
          } else if (value.code == 483) {//抽奖已3次提示
            that.setData({
              masklayer: !that.data.masklayer,
              eventtype: 3,
              boxexchange: 3
            })
          } else {
            that.setData({
              boxshow: false
            });
            setTimeout(function () {
              that.setData({
                boxshow: true
              });
            }, 2000);
          }
        },
        fail: function (res) {
          console.log('提交失败');
        }
      });
    } else {
      that.setData({
        assistmannum: 9,
        boxshow: false
      });
      setTimeout(function () {
        that.setData({
          boxshow: true
        });
      }, 2000);
    }
  },

  /**
   * 确认领取礼物
   */
  chestcollection: function (e) {
    var that = this;
    if (e.currentTarget.dataset) {
      if (e.currentTarget.dataset.wayofwin == 2) {
        that.setData({
          eventtype: 4,
          exchangetype: 2
        })
      } else {
        var money_discount = parseFloat(that.data.giftname.money * that.data.rate).toFixed(2);
        that.setData({
          condition: 5,
          discountmoney: money_discount
        })
      }
    }
  },

  /**
   * 确认领取礼物
   */
  startexchange: function (e) {
    this.setData({
      eventtype: 4,
      exchangetype: 1
    })
  },

  /**
   * 确认领取礼物
   */
  exchange_money: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = {
        token: token,
        active_id: that.options.id,
        goods_id: that.data.giftname.id,
        formid: e.detail.formId,
        send_type: 2
      };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/exchange',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              condition: 6
            })
          } else {
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          console.log('提交失败');
        }
      });
    }
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
    if (res.from === 'button' && that.data.noshownotice == 0) {
      // 来自页面内转发按钮
      that.setData({
        eventtype: 2
      })
    }
    return {
      title: '点一下，你和TA都能获得海盗来了道具奖励！',
      path: 'pages/friendassist/priatefriendass?id=' + that.options.id + '&&zg_id=' + that.data.zg_id,
      desc: '',
      imageUrl: 'https://qmzgcdn.boc7.net/test/pirate_share.jpg'
    }
  }
})