import SparkMD5 from "spark-md5";
export function parseQuerystring(obj) {
  let result = '';
  if (obj) {
    let tmp = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        if (value instanceof Array && value.length) {
          value.forEach((v) => {
            tmp.push(`${key}=${encodeURIComponent(v)}`);
          })
        } else {
          tmp.push(`${key}=${encodeURIComponent(value)}`);
        }
      }
    }
    result = tmp.join('&');
  }
  return result;
}

/**
 * 根据原文件名获取上传到文件服务器的文件名称，用于上传文件
 * @param {string} fileName 原文件名称
 * @param {string} prefix 新文件名前缀
 */
export function getFileKey(fileName, prefix = 'DABANJIA') {
  var time = Date.now();
  var random = Math.floor(Math.random() * 10000);
  var rdStr = ('0000' + random).substr(-4);
  var key = prefix + '_' + time + '_' + rdStr;
  if (fileName && /(.*)\.(\w+)$/.test(fileName)) {
    return fileName.replace(/(.*)\.(\w+)$/, function (text, name, suffix) {
      return key + '.' + suffix;
    })
  }
  return key;
}

/**
 * 解析url返回一个解析对象
 * @param {string} url
 */
export function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length, i = 0, s;
      for (; i < len; i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}

export function formatFileSize(fileSize, idx = 0) {
  fileSize = typeof fileSize === 'number' ? fileSize : 0;
  const units = [" B", " KB", " MB", " GB"];
  if (fileSize < 1024 || idx === units.length - 1) {
    return fileSize.toFixed(1) + units[idx];
  }
  return formatFileSize(fileSize / 1024, ++idx);
}

export function getFileMd5(file, callback) {
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = function (e) {
    console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      console.log('finished loading');
      var hash = spark.end();
      console.info('computed hash', hash);  // Compute hash
      callback(hash);
    }
  };

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };

  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();

}

/**
 * 树节点中的children为空数组时，将其值更改为null，否则el-cascade组件会认为后面还有子节点
 * @param {array} children
 * @param {string} childrenKey
 */
export function filterChildren(children, childrenKey) {
  for (var i = 0; i < children.length; i++) {
    var item = children[i];
    if (item && item[childrenKey]) {
      if (item[childrenKey].length == 0) {
        item[childrenKey] = null;
      } else {
        filterChildren(item[childrenKey], childrenKey);
      }
    }
  }
}


/**
 * 获取节点id在树中的路径，返回路径数组
 * @param {array|object} tree 树数据
 * @param {string|number} nodeId 节点id
 * @param {string} childrenKey 子节点key，默认是‘children’
 * @param {string} idKey id的key，默认是‘id’
 * @return {array} id路径数据
 */
export function getNodePathInTree(tree, nodeId, childrenKey = 'children', idKey = 'id') {
  function getPath(tree, paths) {
    for (let i = 0; i < tree.length; i++) {
      let node = tree[i];
      if (node[idKey] == nodeId) {
        return [...paths, node[idKey]];
      }
      if (node[childrenKey] && node[childrenKey].length) {
        let res = getPath(node[childrenKey], [...paths, node[idKey]]);
        if (res && res.length) {
          return res;
        }
      }
    }
    return [];
  }
  if (typeof tree !== 'object') {
    console.error("不是一个树节点", tree);
    return;
  }
  if (Object.prototype.toString.call(tree) === '[object Array]') {
    return getPath(tree, []);
  } else {
    return getPath([tree], []);
  }
}