export class Util {
  static hasClass(el: any, className: any) {
    if (el.classList) return el.classList.contains(className);
    else return !!el.getAttribute('class').match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  };

  static addClass(el: any, className: any) {
    var classList = className.split(' ');
    if (el.classList) el.classList.add(classList[0]);
    else if (!this.hasClass(el, classList[0])) el.setAttribute('class', el.getAttribute('class') +  " " + classList[0]);
    if (classList.length > 1) this.addClass(el, classList.slice(1).join(' '));
  };

  static removeClass(el: any, className: any) {
    var classList = className.split(' ');
    if (el.classList) el.classList.remove(classList[0]);
    else if(this.hasClass(el, classList[0])) {
      var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
      el.setAttribute('class', el.getAttribute('class').replace(reg, ' '));
    }
    if (classList.length > 1) this.removeClass(el, classList.slice(1).join(' '));
  };

  static toggleClass(el: any, className: any, bool: boolean) {
    if(bool) this.addClass(el, className);
    else this.removeClass(el, className);
  };

  static setAttributes(el: any, attrs: any) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  };
}
