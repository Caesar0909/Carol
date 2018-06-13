function StringUtils () {

  function canBeConvertedToJson (str) {

      try {
          JSON.parse(str);
      }
      catch (e) {
          return false;
      }

      return true;
  }

  function getFragment (str, splitOn, index) {

      if (index === undefined || isNaN(index)) {
          index = 0;
      }
      var fragments = str.split(splitOn);

      if (fragments.length > index) {
          return fragments[index];
      }

      return '';
  }

  function getFragmentInverse (str, splitOn, index) {

      if (index === undefined || isNaN(index)) {
          index = 0;
      }
      var fragments = str.split(splitOn);

      if (fragments.length > index) {
          fragments.splice(index, 1);

          return fragments.join(splitOn);
      }

      return '';
  }


  function parseUrlHash (str) {

      if (typeof str !== 'string') {
          return {};
      }

      return str.split('&').reduce(function (hashMap, param) {

          var parts = param.split('=');

          if (!parts[0]) {
              return hashMap;
          }

          hashMap[parts[0]] = parts[1];

          return hashMap;
      }, {});
  }

  function replaceAllSpaces (str) {

      if (str) {
          return str.split(' ').join('');
      }

      return '';
  }

  function startsWith (str, value) {
      return str.indexOf(value) === 0;
  }

  function endsWith (str, value) {
      var pos = str.length - value.length;
      var lastIndex = str.lastIndexOf(value, pos);

      return lastIndex !== -1 && lastIndex === pos;
  }

  function removeNonAlphaUnderscore (str) {
      return str.replace(/[^a-z0-9_]+|\s+/gmi, '');
  }

  function transformCamelCaseToTagName (str) {
      return str.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1-$2').toLowerCase();
  }

  function urlSafeName (name) {

      if (!name) {
          return 'UNDEFINED';
      }

      return name.replace(/[^a-z0-9\.]/gi, '-').toLowerCase();
  }

  function jsSafeName (name) {

      if (!name) {
          return 'js_' + name;
      }

      if (!isNaN(name.charAt(0))) {
          name = '_' + name;
      }

      return name.replace(/[^a-z0-9]/gi, '_');
  }

  function wrapAroundMatchesInString (value, match, prefix, postfix) {

      var str = String(value);
      var strLC = str.toLowerCase();
      var allMatches = strLC.split(match.toLowerCase());

      if (allMatches.length > 1) {

          var resultStr = str.substring(0, allMatches[0].length);
          var cursor = resultStr.length;

          for (var i = 1; i < allMatches.length; i++) {

              resultStr += prefix + str.substring(cursor, cursor += match.length) + postfix + str.substring(cursor, cursor += allMatches[i].length);
          }

          return resultStr;
      }

      //return prefix + str + postfix;
      return str;
  }

  function clipboardCopy (idInput) {
      //because of browser's policies we just can copy to clipboard values from an input
      var copyTextarea = document.getElementById(idInput);

      try {

          if (copyTextarea && copyTextarea.value) {
              copyTextarea.select();
          }
          else {
              throw new Error('select');
          }
          if (!document.execCommand('copy')) {
              throw new Error('execCommand');
          }
          console.success('URL copied to clipboard');
      }
      catch (err) {

          if (err.message === 'execCommand') {
              console.error('This browser doesn\'t support this feature');
          }
          else {
              console.error('Sorry, we can\'t copy this value');
          }
      }
  }

  function highlightMatches (label, query) {
      var regExOperators = /[|\\{}()[\]^$+*?.]/g;
      var highlighter = new RegExp('(' + query.replace(regExOperators, '\\$&').split(' ').join('|') + ')', 'gi');

      label = String(label);

      return highlighter.test(label) ? label.replace(highlighter, '<b class="search-result__highlight">$1</b>') : label;
  }

  function capitalizeFirstLetter (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return {
      canBeConvertedToJson: canBeConvertedToJson,
      getFragment: getFragment,
      getFragmentInverse: getFragmentInverse,
      parseUrlHash: parseUrlHash,
      replaceAllSpaces: replaceAllSpaces,
      startsWith: startsWith,
      endsWith: endsWith,
      transformCamelCaseToTagName: transformCamelCaseToTagName,
      urlSafeName: urlSafeName,
      jsSafeName: jsSafeName,
      removeNonAlphaUnderscore: removeNonAlphaUnderscore,
      wrapAroundMatchesInString: wrapAroundMatchesInString,
      clipboardCopy: clipboardCopy,
      highlightMatches: highlightMatches,
      capitalizeFirstLetter
  };

}

export default new StringUtils();
