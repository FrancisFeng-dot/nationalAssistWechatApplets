// pages/makebattle/makebattle.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    exchangelayer: true,//遮罩层默认关闭商城兑换弹框
    contactlayer: true,//客服弹框
    giftorbattle: 0,//礼包中心或者战力链接的弹框类型
    goodslist: [],//商品列表
    insufficientbattle: 0,//战力不足
    exchange: { goodsname: '', battlevalue: 0, goodsid: 0 },//兑换物品的名称和战力值
    freeexchange: '',//兑换点击的商品编号
    generateimage: '',//canvas生出的图片路径
    needbattle: 0,//试玩游戏获得的战力
    consumptionbattle: 0,//邀请好友提升的战力
    gamelist: [],//游戏列表
    battle: 0,//战力值
    signin: 0,//是否签到
    remain_signin:0,//是否开启签到提醒
    //has_signnum:0,//已经签到的天数
    //signstar: [],
    //friendcount: 0,//邀请好友的数量
    //attention:0,//是否关注公众号
    layertype: 0,//弹框类型
    hastoken: 0,//是否授权
    //mobile_goods: [{ mobile_points: 90, battle_value: 5000, money: 0.5, id: 125 }, { mobile_points: 430, battle_value: '2.5w', money: 2.5, id: 126 }],//移动积分兑换商品
    battlereceive_back: 'battleshow_circle0.png',
    contribute_strength:0,//被邀请人贡献的战力值
    contribute_strength2:0,//作为被展示的领取战力值
    userid:'',
    signinreward:0,//每日签到奖励
    signbattlegift_back: 'battleshow_circle2.png',//每日签到背景
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loadingHidden: false,
    randommini: { url: '', appid: '', miniimg:''},
    user:{headimg:'',nickname:'',mymoney:0.00}
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
    data = app.encrypt(JSON.stringify({token:token}));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzg.boc7.net/integrateIndex',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          //var arr = [];
          var num = value.data.sign_integrate;
          if (token) {
            if (value.data.continue_sign.length >= 0 && value.data.continue_sign.length < 6){
              num = num + 100 * value.data.continue_sign.length;
            } else if (value.data.continue_sign.length == 6){
              num = num + 1500;
            }
          }
            // for (var i = 0; i < 7; i++) {
            //   if (value.data.continue_sign[i] > 0) {
            //     arr.push({ 'hassign': 1, 'num': num });
            //   } else {
            //     arr.push({ 'hassign': 0, 'num': num });
            //   }
            //   if (i == 5) {
            //     num += 1000;
            //   } else {
            //     num += 100;
            //   }
            // }
            // if (value.data.continue_sign.length > 0) {
            //   that.setData({
            //     has_signnum: value.data.continue_sign.length
            //   })
            // }
          // else{
          //   for (var i = 0; i < 7; i++) {
          //     arr.push({ 'hassign': 0, 'num': num });
          //     if (i == 5) {
          //       num += 1000;
          //     } else {
          //       num += 100;
          //     }
          //   }
          // }
          that.setData({
            signinreward:num,
            battle: token?that.data.battle + value.data.self_integrate:0,
            userid: token ? value.data.uid : '',
            signin: token ? value.data.is_sign : 0,//是否签到
            contribute_strength: token ? value.data.teacherIntegrate : 0,
            contribute_strength2: token ? value.data.teacherIntegrate : 0,
            remain_signin: token ? value.data.is_enable_sign : 0,
            //friendcount: value.data.count,
            hastoken: token ? 1 : 0,
            user: token ? { headimg: value.data.user.headimg, nickname: value.data.user.nickname, mymoney: value.data.qb } : { headimg: '', nickname: '', mymoney: 0.00},
            //signstar: arr,
            goodslist: value.data.goods,
            consumptionbattle: value.data.friends_integrate,//邀请好友提升的战力
            needbattle: value.data.game_integrate,//试玩游戏获得的战力
            gamelist: value.data.game,
            loadingHidden: true,
            masklayer: !that.data.masklayer,
            layertype: 8
          });
          if (token) {
            if (value.data.teacherIntegrate > 0) {
              var percentagebattle = parseInt(value.data.teacherIntegrate) / 10000;
              if (percentagebattle > 0 && percentagebattle < 0.2) {
                that.setData({
                  battlereceive_back: 'battleshow_circle1.png'
                });
              } else if (percentagebattle > 0.2 && percentagebattle < 0.4) {
                that.setData({
                  battlereceive_back: 'battleshow_circle2.png'
                });
              } else if (percentagebattle > 0.4 && percentagebattle < 0.6) {
                that.setData({
                  battlereceive_back: 'battleshow_circle3.png'
                });
              } else if (percentagebattle > 0.6 && percentagebattle < 0.8) {
                that.setData({
                  battlereceive_back: 'battleshow_circle4.png'
                });
              } else if (percentagebattle > 0.8) {
                that.setData({
                  battlereceive_back: 'battleshow_circle5.png'
                });
              }
              var signintegrate = parseInt(that.data.signinreward) / 2000;
              if (signintegrate < 0.4) {
                that.setData({
                  signbattlegift_back: 'battleshow_circle2.png'
                });
              } else if (percentagebattle > 0.4 && percentagebattle < 0.6) {
                that.setData({
                  signbattlegift_back: 'battleshow_circle3.png'
                });
              } else if (percentagebattle > 0.6 && percentagebattle < 0.8) {
                that.setData({
                  signbattlegift_back: 'battleshow_circle4.png'
                });
              } else if (percentagebattle > 0.8) {
                that.setData({
                  signbattlegift_back: 'battleshow_circle5.png'
                });
              }
            };
          }
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
            loadingHidden: true,
            masklayer: !that.data.masklayer,
            layertype: 6
          })
        }
      }, fail: function (res) {
        console.log('获取战力榜信息失败');
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
   * 邀请好友
   */
  invite_friend: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      layertype:4
    })
  },

  /**
   * 领取战力弹框
   */
  click_invitebattle: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if(token){
      if (e.currentTarget.dataset) {
        if (e.currentTarget.dataset.invitetype == 1) {
          if (token) {
            var data = { token: token };//token字符串转成对象
            data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
            wx.request({
              url: 'https://qmzg.boc7.net/harvestIntegrate',
              method: 'post',
              data: { data: data },//字符串转成json对象
              success: function (res) {
                var value = app.decrypt(res.data);
                if (value.code == 0) {
                  that.setData({
                    masklayer: !that.data.masklayer,
                    layertype: 2,
                    battle: that.data.battle + that.data.contribute_strength,
                    battlereceive_back: 'battleshow_circle0.png',
                    contribute_strength: 0
                  });
                }
              }
            })
          }
        } else {
          that.setData({
            masklayer: !that.data.masklayer,
            layertype: 3
          })
        }
      }
    }else{
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
        layertype: 6
      });
    }
  },

  /**
   * 领取提醒开关
   */
  switch_remain: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (e.currentTarget.dataset&&token) {
      var data = { token: token, 'type': e.currentTarget.dataset.remaintype};//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/switchSign',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              remain_signin: e.currentTarget.dataset.remaintype
            });
          }
        }
      })
    }
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
      })
    }else{
      setTimeout(function(){
        var token = wx.getStorageSync('token');
        if (token) {
          var frontback = app.globaldata.gametime;
          var interval = 0;//记录玩游戏的时间
          var setinterval = setInterval(function () {
            frontback = app.globaldata.gametime;
            interval += 1;
            if (interval >= 20) {
              clearInterval(setinterval);
              var data = { token: token, game_id: that.data.gamelist[index].id };//token字符串转成对象
              data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
              wx.request({
                url: 'https://qmzg.boc7.net/gameAdd',
                method: 'post',
                data: { data: data },//字符串转成json对象
                success: function (res) {
                  var value = app.decrypt(res.data);
                  if (value.code == 0) {
                    var arr = that.data.gamelist;
                    for (var i = 0; i < arr.length; i++) {
                      if (i == index) {
                        arr[i].has_play = 1;
                      }
                    }
                    that.setData({
                      masklayer: !that.data.masklayer,
                      layertype: 1,
                      gamelist: arr
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
                if (that.data.gamelist[index].has_play != 1) {
                  wx.showToast({
                    title: '需要停留20秒，才算试玩成功哦~',
                    icon: 'none',
                    duration: 2000
                  });
                }
              }
            }
          }, 1000);
        };
      },5000);
    }
  },

  /**
   * 用户做任务
   */
  attentionpublic: function (e) {
    this.setData({
      masklayer: !this.data.masklayer,
      layertype: 5
    })
  },

  /**
   * 授权弹框
   */
  layerGetuser: function (e) {
    var that = this;
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
      layertype: 6
    })
  },

  /**
   * 开启或关闭签到提醒
   */
  // remainedsign: function (e) {
  //   var that = this;
  //   that.setData({
  //     remind: e.currentTarget.dataset.type == 0 ? 0 : 1
  //   })
  //   if (e.currentTarget.dataset.type == 0) {
  //     wx.showToast({
  //       title: '红包提醒已关闭',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '红包提醒已开启',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   }
  //   var token = wx.getStorageSync('token');
  //   if (token) {
  //     var data = { token: token, 'type': e.currentTarget.dataset.type };//token字符串转成对象
  //     data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
  //     wx.request({
  //       url: 'https://qmzg.boc7.net/switchSign',
  //       method: 'post',
  //       data: { data: data },//字符串转成json对象
  //       success: function (res) {
  //         var value = app.decrypt(res.data);
  //       },
  //       fail: function (res) {
  //         console.log('重置提醒失败');
  //       }
  //     })
  //   }else {
  //     wx.navigateTo({
  //       url: '/pages/login/login'
  //     })
  //   }
  // },

  /**
   * 用户签到
   */
  clicksign: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = { token: token, formid: e.detail.formId };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/sign',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            // wx.showToast({
            //   title: '签到成功，战力增加+' + value.integrate,
            //   icon: 'none',
            //   duration: 2000
            // })
            // var arr = that.data.signstar;
            // if (that.data.has_signnum==7) {
            //   for(var i=0;i<7;i++){
            //     if (i > 0) {
            //       arr[i].hassign = 0;
            //     }
            //   }
            //   that.setData({
            //     has_signnum: 1
            //   })
            // } else {
            //   arr[that.data.has_signnum].hassign = 1;
            //   that.setData({
            //     has_signnum: that.data.has_signnum + 1
            //   })
            // }
            var timestamp = new Date().getTime();
            var timestamp1 = parseInt(timestamp / 10000);
            var timestamp2 = timestamp % (timestamp1);
            var timestamp3 = timestamp2 % 4;
            that.setData({
              signin: 1,
              //signstar: arr,
              battle: that.data.battle + value.integrate,
              masklayer: !that.data.masklayer,
              layertype:7,
              randommini: timestamp3 == 0 ? { url: '?chid=2020&subchid=124', appid: 'wx79ade44c39cefc7f', miniimg: 'https://qmzgcdn.boc7.net/test/ads_chuanqilaile1.png' } : (timestamp3 == 1 ? { url: '?appId=100001&amp;a=1&b=2', appid: 'wx5ec3f4bdf677b97b', miniimg: 'https://qmzgcdn.boc7.net/test/ads_quanminfangkuai1.png' } : (timestamp3 == 2 ? { url: 'pages/base/redirect/index?routeKey=PROMOTION_GIFT_PACKAGE&p=PA01&s=act_travel_share&wtagid=104.72.43', appid: 'wx06a561655ab8f5b2', miniimg: 'https://qmzgcdn.boc7.net/test/ads_weibao1.jpg' } : { url: '?channel=mengmob28', appid: 'wx78caa30cd32c16b9', miniimg: 'https://qmzgcdn.boc7.net/test/ads_xiyouhouzhuan1.png' }))
            })
          }
          if (value.code == 454) {
            wx.showToast({
              title: '重复签到',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          console.log('获取首页信息失败');
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
        layertype: 6
      })
    }
  },

  /**
   * 战力数字滚动
   */
  battlenumscroll: function (res) {
    var that = this;
    that.setData({
      battle: that.data.battle + res
    })
    // var batstr = res.toString();
    // var battlearr = [];
    // var recordbattle = res;
    // for (var k = 0; k < batstr.length; k++) {
    //   setTimeout(function (k) {
    //     return function () {
    //       battlearr.push(recordbattle % 10);
    //       recordbattle = parseInt(recordbattle / 10);
    //       if (battlearr[k] !== 0) {
    //         for (var j = 1; j <= battlearr[k]; j++) {
    //           setTimeout(function (j) {
    //             return function () {
    //               that.setData({
    //                 battle: that.data.battle + Math.pow(10, k)
    //               })
    //             }
    //           }(j), j * 100)
    //         }
    //       }
    //     }
    //   }(k), k * 80)
    // }
  },

  /**
   * 用户授权
   */
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.encryptedData) {
      app.requesttoken(that.data.loginCode, e.detail, '', '','');
    }
  },

  /**
   * 遮罩层默认关闭商城兑换弹框
   */
  closeexchange: function (e) {
    this.setData({
      exchangelayer: !this.data.exchangelayer
    })
  },

  /**
   * 客服类型弹框
   */
  closecontact: function (e) {
    this.setData({
      contactlayer: !this.data.contactlayer
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
   * 用户点击兑换
   */
  redeemgoods: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var index = e.currentTarget.dataset.index;
      if (that.data.battle >= that.data.goodslist[index].battle) {
        var data = { token: token, goods_id: that.data.goodslist[index].id };//token字符串转成对象
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        if (that.data.goodslist[index].type == 1) {
          wx.request({
            url: 'https://qmzg.boc7.net/confirmExchange',
            method: 'post',
            data: { data: data },//字符串转成json对象
            success: function (res) {
              var value = app.decrypt(res.data);
              if (value.code == 0) {
                that.setData({
                  exchangelayer: !that.data.exchangelayer,
                  insufficientbattle: 0,
                  exchange: { goodsname: that.data.goodslist[index].goods_name, battlevalue: that.data.goodslist[index].battle, goodsid: that.data.goodslist[index].id }
                })
              }else if (value.code == 450) {
                wx.showToast({
                  title: value.msg,
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail: function (res) {
              console.log('参数错误1');
            }
          });
        } else if (that.data.goodslist[index].type == 5) {
          that.setData({
            contactlayer: !that.data.contactlayer,
            giftorbattle: 2,
            freeexchange: index
          })
        }//红包兑换
      } else {
        wx.getImageInfo({
          src: 'https://qmzgcdn.boc7.net/test/goodskin2.jpg',
          success: function (res) {
            var backgroundimg = res.path;
            wx.getImageInfo({
              src: that.data.goodslist[index].big_img,
              success: function (res) {
                console.log(res);
                var ctx = wx.createCanvasContext('shareCanvas');
                ctx.drawImage(backgroundimg, 0, 0, 188, 150);
                ctx.drawImage(res.path, 8, 16, 72, 72);
                ctx.setTextAlign('left');
                ctx.setFillStyle('#333333');
                ctx.font = "bold 8px MicrosoftYaHei";
                ctx.fillText(that.data.goodslist[index].goods_name, 86, 36);
                ctx.setFillStyle('#FE4141');
                ctx.font = "normal 9px MicrosoftYaHei";
                ctx.fillText(that.data.goodslist[index].battle + '战力', 86, 64);
                ctx.setFillStyle('#999999');
                ctx.setFontSize(8);
                ctx.fillText('价值：' + that.data.goodslist[index].money + '元', 86, 82);
                ctx.stroke();
                ctx.draw();
                wx.canvasToTempFilePath({
                  canvasId: 'shareCanvas',
                  fileType: 'jpg',
                  success: function (res2) {
                    console.log(res2.tempFilePath);
                    that.setData({
                      exchangelayer: !that.data.exchangelayer,
                      insufficientbattle: 1,
                      freeexchange: index,
                      generateimage: res2.tempFilePath
                    })
                  }
                });
              },
              fail: function (res) {
                console.log('获取失败');
              }
            })
          }
        })
      }
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
        layertype: 6
      })
    }
  },

  /**
   * 红包兑换的方法
   */
  confirm_money: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token && e.currentTarget.dataset) {
      var index = e.currentTarget.dataset.index;
      var data = { token: token, goods_id: that.data.goodslist[index].id };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/moneyExchange',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              //battle: that.data.battle - value.data.integrate,
              contactlayer: !that.data.contactlayer
            })
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 3000
            })
          } else if (value.code == 433) {
            that.setData({
              giftorbattle: 3
            })
          } else {
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail: function (res) {
          console.log('参数错误2');
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 兑换信息提交
   */
  submitinfo: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    // if (e.detail.value.input3.length < 5 || !parseInt(e.detail.value.input3)) {
    //   wx.showToast({
    //     title: 'QQ信息格式不正确，请重新输入',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else {
    if (token) {
      var data = {
        token: token,
        goods_id: that.data.exchange.goodsid,
        wx_number: e.detail.value.input1,
        wx_nickname: e.detail.value.input2,
        qq: e.detail.value.input3,
        formid: e.detail.formId
      };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzg.boc7.net/exchangeShopGoods',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          if (value.code == 0) {
            that.setData({
              exchangelayer: !that.data.exchangelayer,
              //battle: that.data.battle - that.data.exchange.battlevalue
            })
          }
          wx.showToast({
            title: value.msg,
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (res) {
          console.log('提交失败');
        }
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      masklayer: true,//遮罩层默认关闭
      exchangelayer: true,//遮罩层默认关闭商城兑换弹框
      contactlayer: true,//客服弹框
      giftorbattle: 0,//礼包中心或者战力链接的弹框类型
      goodslist: [],//商品列表
      insufficientbattle: 0,//战力不足
      exchange: { goodsname: '', battlevalue: 0, goodsid: 0 },//兑换物品的名称和战力值
      freeexchange: '',//兑换点击的商品编号
      generateimage: '',//canvas生出的图片路径
      needbattle: 0,//试玩游戏获得的战力
      consumptionbattle: 0,//邀请好友提升的战力
      gamelist: [],//游戏列表
      battle: 0,//战力值
      signin: 0,//是否签到
      remain_signin: 0,//是否开启签到提醒
      layertype: 0,//弹框类型
      hastoken: 0,//是否授权
      battlereceive_back: 'battleshow_circle0.png',
      contribute_strength: 0,//被邀请人贡献的战力值
      contribute_strength2: 0,//作为被展示的领取战力值
      userid: '',
      signinreward: 0,//每日签到奖励
      signbattlegift_back: 'battleshow_circle2.png',//每日签到背景
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      loadingHidden: false,
      randommini: { url: '', appid: '', miniimg: '' },
      user: { headimg: '', nickname: '', mymoney: 0.00 }
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
   * 用户滑动页面事件
   */
  // onPageScroll: function (res) {
  //   console.log(res);
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (that.data.userid) {//已经加密
      if (res.target && res.target.dataset.freeindex + 1) {//商城邀请
        var index = res.target.dataset.freeindex;
        return {
          title: '我在全民助攻换『' + that.data.goodslist[index].goods_name + '』，点一下一起换！',
          path: 'pages/index/index?userid=' + that.data.userid,
          desc: '',
          imageUrl: that.data.generateimage
        }
      } else{
        return {
          title: '【有人@你】点一下，助攻领红包啦！',
          path: 'pages/index/index?userid=' + that.data.userid,
          desc: '',
          imageUrl: 'https://qmzgcdn.boc7.net/test/index_share3.jpg'
        }
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