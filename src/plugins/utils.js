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
  } else if (transData === 2) {
    return '女'
  } else if (transData === '男') {
    return 1
  } else {
    return 2
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
export {
  timestampToTime,
  easyTimestamp,
  easyChangeGender,
  operateAge,
  operateGPA
}
