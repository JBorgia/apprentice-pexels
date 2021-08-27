export class UtilService {
  
  hasClass(el: any, className: any) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!el.className.match(
        new RegExp('(\\s|^)' + className + '(\\s|$)')
      );
    }
  }

  addClass(el: any, className: any) {
    const classList = className.split(' ');
    if (el.classList) {
      el.classList.add(classList[0]);
    } else if (!this.hasClass(el, classList[0])) {
      el.className += ' ' + classList[0];
    }
    if (classList.length > 1) {
      this.addClass(el, classList.slice(1).join(' '));
    }
  }

  removeClass(el: any, className: any) {
    const classList = className.split(' ');
    if (el.classList) {
      el.classList.remove(classList[0]);
    } else if (this.hasClass(el, classList[0])) {
      const reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
    if (classList.length > 1) {
      this.removeClass(el, classList.slice(1).join(' '));
    }
  }

  toggleClass(el: any, className: any, bool: any) {
    if (bool) {
      this.addClass(el, className);
    } else {
      this.removeClass(el, className);
    }
  }
}
