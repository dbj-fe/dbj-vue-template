const queryMap = new Map();

export default {
  computed: {
    _isRootQuery() {
      let parent = this.$parent;
      while (parent) {
        if (parent._isRootQuery) {
          return false;
        }
        parent = parent.$parent;
      }
      return true;
    }
  },
  watch: {
    query: {
      handler(val) {
        let query = queryMap.get(this.$route.name);
        if (isChanged(query, val)) {
          queryMap.set(this.$route.name, copyObj(query, val, false));
        }
        let rQuery = simplifyQuery(objToRouteQuery(queryMap.get(this.$route.name)));
        if (isChanged(this.$route.query, rQuery)) {
          this.$router.push({
            path: this.$route.path,
            query: simplifyQuery({ ...this.$route.query, ...rQuery })
          })
        }
      },
      deep: true
    }
  },
  created() {
    if (this._isRootQuery) {
      let queryRoute = this.$route.query;
      if (!isEmpty(queryRoute)) {
        queryMap.set(this.$route.name, routeQueryToObj(queryRoute));
      }
    }
    let query = queryMap.get(this.$route.name);
    if (!isEmpty(query)) {
      copyObj(this.query, query, true);
    }
  }
}

export function clearQuery() {
  queryMap.clear();
}

function isEmpty(obj) {
  return !obj || !Object.keys(obj).length;
}

function isNumber(str) {
  return /^-?(0|[1-9]\d*(\.\d+)?)$/.test(str);
}

function isBoolean(str) {
  return /^(true|false)$/.test(str);
}

function toBoolean(str) {
  return str === "true";
}

function isArray(str) {
  return /^\[-?\w+(,-?\w+)*\]$/.test(str);
}

function toArray(str) {
  return str.replace(/^\[/, '').replace(/\]$/, '').split(",")
    .map(item => isNumber(item) ? +item : isBoolean(item) ? toBoolean(item) : item)
}

function arrayToStr(array) {
  return '[' + array.join(',') + ']'
}

/**
 * 对象深拷贝，当useDestKeys为true时，仅将目标对象包含的属性从源对象复制过来
 *
 * @param {object} dest 目标对象
 * @param {object} src 数据源对象
 * @param {boolean} useDestKeys 是否以目标对象的包含的属性为准复制
 */
function copyObj(dest, src, useDestKeys) {
  if (!src) {
    return dest;
  }
  if (!useDestKeys && !dest) {
    dest = Object.create(null);
  }
  let keys = Object.keys(useDestKeys ? dest : src);
  for (const key of keys) {
    let sVal = src[key];
    if (typeof sVal !== "undefined") {
      let type = Object.prototype.toString.call(sVal);
      if (type === "[object Object]") {
        if (!useDestKeys && !dest[key]) {
          dest[key] = Object.create(null);
        }
        copyObj(dest[key], src[key], useDestKeys);
      } else if (type === "[object Array]") {
        if (typeof dest[key] === "string") {
          dest[key] = arrayToStr(src[key]);
        } else {
          dest[key] = [...src[key]];
        }
      } else {
        dest[key] = src[key];
      }
    }
  }
  return dest;
}

/**
 * 新对象相对于旧对象是否有变化，旧对象的属性个数可能比新对象要多，例如：
 * oldObj = {x: 1, y: 2};newObj = {x: 1};返回false
 * oldObj = {x: 1, y: 2};newObj = {x: 2};返回true
 *
 * @param {object} oldObj 旧对象
 * @param {object} newObj 新对象
 */
function isChanged(oldObj, newObj) {
  if (oldObj === newObj) {
    return false;
  }
  if (isEmpty(oldObj) && !isEmpty(newObj)) {
    return true;
  }
  let keys = Object.keys(newObj);
  for (const key of keys) {
    if (oldObj[key] === newObj[key]) {
      continue;
    }
    let type = Object.prototype.toString.call(newObj[key]);
    if (type === "[object Object]") {
      if (isChanged(oldObj[key], newObj[key])) {
        return true;
      }
    } else if (type === "[object Array]") {
      if (oldObj[key].length !== newObj[key].length) {
        return true;
      }
      if (isChanged(oldObj[key], newObj[key])) {
        return true;
      }
    } else if (oldObj[key] !== newObj[key]) {
      return true;
    }
  }
  return false;
}

/**
 * 将对象转成query对象，是routeQueryToObj方法的反向操作，例如：
 * {x: 1, y: {m: 2, n: 3}, z: 4}
 * =>
 * {
 *   x: 1,
 *   "y.m": 2,
 *   "y.n": 3,
 *   z: 4
 * }
 *
 * @param {object} obj 要转换的对象
 * @param {array?} preKeys 非必须，递归用
 * @param {object?} query 非必须，递归用
 */
function objToRouteQuery(obj, preKeys, query) {
  preKeys = preKeys || [];
  query = query || Object.create(null);
  if (isEmpty(obj)) {
    return query;
  }
  let keys = Object.keys(obj);
  for (const key of keys) {
    let value = obj[key];
    let type = Object.prototype.toString.call(value);
    if (type === "[object Object]") {
      objToRouteQuery(obj[key], [...preKeys, key], query);
    } else if (type === "[object Array]") {
      query[[...preKeys, key].join(".")] = arrayToStr(obj[key]);
    } else {
      query[[...preKeys, key].join(".")] = obj[key];
    }
  }
  return query;
}

/**
 * 将query对象转成对象，是objToRouteQuery方法的反向操作，例如：
 * {
 *   x: 1,
 *   "y.m": 2,
 *   "y.n": 3,
 *   z: 4
 * }
 * =>
 * {x: 1, y: {m: 2, n: 3}, z: 4}
 *
 * @param {object} query 要转换的query对象
 */
function routeQueryToObj(query) {
  let obj = Object.create(null);
  if (isEmpty(query)) {
    return obj;
  }
  let keys = Object.keys(query);
  for (const key of keys) {
    let ks = key.split(".");
    let value = query[key];
    if (isNumber(value)) {
      value = +value;
    } else if (isBoolean(value)) {
      value = toBoolean(value);
    } else if (isArray(value)) {
      value = toArray(value);
    }
    let prop = obj;
    for (let i = 0; i < ks.length; i++) {
      if (i === ks.length - 1) {
        prop[ks[i]] = value;
      } else {
        prop[ks[i]] = prop[ks[i]] || Object.create(null);
      }
      prop = prop[ks[i]];
    }
  }
  return obj;
}

/**
 * 精简query对象，例如：
 * {
 *   tab: "x",
 *   "x.i": "v",
 *   "x.j": 2,
 *   "y.m": 2,
 *   "y.n": 3,
 *   "z.k": 5,
 *   "v.u": 4,
 *   foo: 4
 * }
 * =>
 * {
 *   tab: "x",
 *   foo: 4,
 *   "x.i": "v",
 *   "x.j": 2,
 *   "v.u": 4
 * }
 *
 * @param {object} query 要被精简的query对象
 */
function simplifyQuery(query) {
  if (isEmpty(query)) {
    return query;
  }
  let keys = Object.keys(query);
  let rootKeys = keys.filter(key => key.indexOf(".") < 0);
  let rootVals = rootKeys.map(key => query[key]).filter(val => typeof val === "string");
  let newVals = [];
  let relatedKeys = keys.filter(key => {
    for (let rootVal of rootVals) {
      if (key.startsWith(rootVal + ".")) {
        if (typeof query[key] === "string") {
          newVals.push(query[key]);
        }
        return true;
      }
    }
    return false;
  });
  let newRelatedKeys = keys.filter(key => {
    for (let newVal of newVals) {
      if (key.startsWith(newVal + ".")) {
        return true;
      }
    }
    return false;
  });
  relatedKeys = [...rootKeys, ...relatedKeys, ...newRelatedKeys];
  let newQuery = Object.create(null);
  for (const key of relatedKeys) {
    newQuery[key] = query[key];
  }
  return newQuery;
}
