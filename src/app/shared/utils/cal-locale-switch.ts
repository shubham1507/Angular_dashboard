import { Injectable } from "@angular/core";

@Injectable()
/**
 * Calendar locale component to provide locale
 * configurations for different locales
 */
export default class CalLocaleSwitch {
  static getLocaleCalendarObj(locale): Object {
    let calLocale = {};
    switch (locale) {
      case "zh": {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "	星期五",
            "星期六",
            "星期日"
          ],
          dayNamesShort: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "	星期五",
            "星期六",
            "星期日"
          ],
          dayNamesMin: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "	星期五",
            "星期六",
            "星期日"
          ],
          monthNames: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          monthNamesShort: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          today: "今天",
          clear: "明确"
        };
        break;
      }
      case "de": {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
            "Sonntag"
          ],
          dayNamesShort: ["Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"],
          dayNamesMin: ["Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"],
          monthNames: [
            "Januar ",
            "Februar ",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezembe"
          ],
          monthNamesShort: [
            "Jan",
            "Feb",
            "Mär",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dez"
          ],
          today: "heute",
          clear: "klar"
        };
        break;
      }
      case "fr": {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "lundi",
            "mardi",
            "mercredi",
            "jeudi",
            "vendredi",
            "samedi",
            "dimanche"
          ],
          dayNamesShort: ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"],
          dayNamesMin: ["lu", "ma", "me", "je", "ve", "sa", "di"],
          monthNames: [
            "janvier",
            "février",
            "mars ",
            "avril ",
            "mai",
            "juin",
            "juillet",
            "aout",
            "septembre",
            "octobre",
            "novembre",
            "décembre"
          ],
          monthNamesShort: [
            "jan",
            "fev",
            "mar",
            "avr",
            "mai",
            "jui",
            "juil",
            "aou",
            "sep",
            "Oct",
            "nov",
            "déc"
          ],
          today: "aujourd'hui",
          clear: "clair"
        };
        break;
      }
      case "en": {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          monthNamesShort: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          today: "Today",
          clear: "Clear"
        };
        break;
      }
      case "hi": {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "रविवार",
            "सोमवार",
            "मंगलवार",
            "बुधवार",
            "गुरुवार",
            "शुक्रवार",
            "शनिवार"
          ],
          dayNamesShort: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
          dayNamesMin: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
          monthNames: [
            "जनवरी",
            "फ़रवरी",
            "मार्च",
            "अप्रैल",
            "मई",
            "जून",
            "जुलाई",
            "अगस्त",
            "सितंबर",
            "अक्‍तूबर",
            "नवंबर",
            "दिसंबर"
          ],
          monthNamesShort: [
            "जनवरी",
            "फ़रवरी",
            "मार्च",
            "अप्रैल",
            "मई",
            "जून",
            "जुलाई",
            "अगस्त",
            "सितंबर",
            "अक्‍तूबर",
            "नवंबर",
            "दिसंबर"
          ],
          today: "आज",
          clear: "स्पष्ट"
        };
        break;
      }
      case "ja": {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "にちようび – 日曜日",
            "げつようび – 月曜日",
            "かようび – 火曜日",
            "すいようび – 水曜日",
            "もくようび – 木曜日",
            "きんようび – 金曜日",
            "どようび – 土曜日"
          ],
          dayNamesShort: [
            "にちようび – 日曜日",
            "げつようび – 月曜日",
            "かようび – 火曜日",
            "すいようび – 水曜日",
            "もくようび – 木曜日",
            "きんようび – 金曜日",
            "どようび – 土曜日"
          ],
          dayNamesMin: [
            "にちようび – 日曜日",
            "げつようび – 月曜日",
            "かようび – 火曜日",
            "すいようび – 水曜日",
            "もくようび – 木曜日",
            "きんようび – 金曜日",
            "どようび – 土曜日"
          ],
          monthNames: [
            "いち がつ 一月",
            "に がつ 二月",
            "さん がつ 三月",
            "し がつ 四月",
            "ご がつ 五月",
            "ろく がつ 六月",
            "しち がつ 七月",
            "はち　がつ",
            "く　がつ",
            "じゅう　がつ",
            "じゅういち　がつ",
            "じゅうに　がつ"
          ],
          monthNamesShort: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "がつ",
            "がつ",
            "がつ",
            "がつ",
            "がつ"
          ],
          today: "今日",
          clear: "クリア"
        };
        break;
      }
      case "ko": {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
            "일요일"
          ],
          dayNamesShort: [
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
            "일요일"
          ],
          dayNamesMin: [
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
            "일요일"
          ],
          monthNames: [
            "월 (일월)",
            "월 (이월)",
            "월 (삼월)",
            "월 (사월)",
            "월 (오월)",
            "월 (유월 )",
            "월 (칠월)",
            "월 (팔월)",
            "월 (구월)",
            "월 (시월)",
            "월 (십일월)",
            "월 (십이월)"
          ],
          monthNamesShort: [
            "월 (일월)",
            "월 (이월)",
            "월 (삼월)",
            "월 (사월)",
            "월 (오월)",
            "월 (유월 )",
            "월 (칠월)",
            "월 (팔월)",
            "월 (구월)",
            "월 (시월)",
            "월 (십일월)",
            "월 (십이월)"
          ],
          today: "오늘",
          clear: "명확한"
        };
        break;
      }
      default: {
        calLocale = {
          firstDayOfWeek: 0,
          dayNames: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          monthNamesShort: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          today: "Today",
          clear: "Clear"
        };
        break;
      }
    }
    return calLocale;
  }
}
