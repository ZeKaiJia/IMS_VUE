// 时间戳转精确日期
function timestampToTime(timestamp) {
  const date = new Date(timestamp)
  const Y = date.getFullYear() + '-'
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  const D =
    date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
  const h =
    date.getHours() < 10
      ? '0' + date.getHours() + ':'
      : date.getHours() + ':'
  const m =
    date.getMinutes() < 10
      ? '0' + date.getMinutes() + ':'
      : date.getMinutes() + ':'
  const s =
    date.getSeconds() < 10
      ? '0' + date.getSeconds()
      : date.getSeconds() + ''
  return Y + M + D + h + m + s
}
// 时间戳转年月日
function easyTimestamp(timestamp) {
  const date = new Date(timestamp)
  const Y = date.getFullYear() + '-'
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  const D =
    date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
  return Y + M + D
}
// 学生性别快速转换
function easyChangeGender (transData) {
  if (transData === 1) {
    return '男'
  } else if (transData === 0) {
    return '女'
  } else if (transData === '男') {
    return 1
  } else {
    return 0
  }
}
// 计算学生年龄
function operateAge (stuBirthday) {
  const timestampStu = stuBirthday.valueOf(stuBirthday)
  const timestampNow = (new Date()).valueOf()
  const dateStu = new Date(timestampStu)
  const dateNow = new Date(timestampNow)
  const stuYear = dateStu.getFullYear()
  const nowYear = dateNow.getFullYear()
  return nowYear - stuYear
}
// 计算课程绩点得分
function operateGPA (subScore) {
  if (subScore > 95) {
    return 5.0
  } else if (subScore < 60) {
    return 0.0
  } else {
    return (50 - (95 - subScore)) / 10
  }
}
// 截取数据
function sliceData (list, currentPage, pageSize) {
  return list.slice((currentPage - 1) * pageSize, pageSize + (currentPage - 1) * pageSize)
}
// 检查错误原因
function checkError (res) {
  if (res === '该账户不存在' || res === '该账户已锁定' || res === '密码错误请重试' ||
    res === '没有相应权限' || res === '操作失败请重试') {
    return res
  } else {
    return ''
  }
}
export {
  timestampToTime,
  easyTimestamp,
  easyChangeGender,
  operateAge,
  operateGPA,
  sliceData,
  checkError
}
